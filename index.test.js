const SetTTL = require('./index');

describe('Drop-in replacement', () => {

	test('SetTTL should be instanceof set', () => {
		const x = new SetTTL();
		expect(x instanceof Set).toBe(true);
	});

});

describe('Constructor', () => {

	test('If no argument was passed, default TTL should be 500ms', () => {
		let x = new SetTTL();
		expect(x.ttl).toBe(500);
	});

	test('Passed TTL should be the same (Number)', () => {
		let x = new SetTTL(650);
		expect(x.ttl).toBe(650);
	});

	test('Passed TTL should be the same (String)', () => {
		let x = new SetTTL("5000");
		expect(x.ttl).toBe(5000);
	});

	test('Invalid constructor argument should throw a RangeError', () => {
		expect(() => {
			return new SetTTL("Invalid String");
		}).toThrow(RangeError);
		expect(() => {
			return new SetTTL(Object.constructor);
		}).toThrow(RangeError);
		expect(() => {
			return new SetTTL(new Set());
		}).toThrow(RangeError);
	});

});


describe('Set parity', () => {

	test('String should be the same across Set and SetTTL', () => {
		const value = "A Cool String"

		let a = new Set();
		let b = new SetTTL();

		a.add(value);
		b.add(value);

		expect(a.has(value) === b.has(value)).toBe(true);
	});

	test('Number should be the same across Set and SetTTL', () => {
		const value = 42

		let a = new Set();
		let b = new SetTTL();

		a.add(value);
		b.add(value);

		expect(a.has(value) === b.has(value)).toBe(true);
	});

	test('Array should be the same across Set and SetTTL', () => {
		const value = [5, "b", {key: "value"}, Infinity]

		let a = new Set();
		let b = new SetTTL();

		a.add(value);
		b.add(value);

		expect(a.has(value) === b.has(value)).toBe(true);
	});

	test('Set.add parity', () => {
		const value = "TEST"
		let a = new Set();
		let b = new SetTTL();

		let c = a.add(value);
		let d =b.add(value);

		expect(a === c && b === d).toBe(true);
	});

	test('Set.has parity', () => {
		const value = "TEST"
		let a = new Set();
		let b = new SetTTL();

		a.add(value);
		b.add(value);

		expect(a.has(value) && b.has(value)).toBe(true);
	});

	test('Set.clear parity', () => {
		const value = "TEST"
		let s = new SetTTL();
		s.add(value);
		let returnVal = s.clear();

		expect(returnVal === undefined && !s.has(value)).toBe(true);
	});

	test('Set.delete parity', () => {
		const value = "TEST"
		let s = new SetTTL();
		s.add(value);
		let returnVal = s.delete(value);

		expect(returnVal === true && !s.has(value)).toBe(true);
	});

	test('Set.size parity', () => {
		let s = new SetTTL();
		s.add("a");
		s.add(5);
		expect(s.size === 2).toBe(true);

		s.delete("NOT_EXIST");
		expect(s.size === 2).toBe(true);

		s.delete("a");
		expect(s.size === 1).toBe(true);

		s.add('A')
		s.add('B')
		s.add('C')
		expect(s.size === 4).toBe(true);

		s.clear();
		expect(s.size === 0).toBe(true);
	});

	test('Set.prototype[@@iterator] parity', () => {
		let s = new SetTTL();
		s.add("a");
		s.add(5);
		const it = s[Symbol.iterator]();

		expect(it.next().value === "a").toBe(true);
		expect(it.next().value === 5).toBe(true);
	});

});

describe('Time To Live', () => {

	test('Key expiry', async () => {
		let s = new SetTTL();
		s.add("test");

		// Only 100ms pass
		await new Promise((r) => setTimeout(r, 100));
		expect(s.has("test")).toBe(true);

		// 600ms have passed now
		await new Promise((r) => setTimeout(r, 500));
		expect(s.has("test")).toBe(false);
	});

	test('Key expiry with extended TTL', async () => {
		let s = new SetTTL();
		s.add("test");

		// Only 100ms pass
		await new Promise((r) => setTimeout(r, 100));
		expect(s.has("test")).toBe(true)

		s.extend("test", 300);

		// 600ms have passed now
		await new Promise((r) => setTimeout(r, 500));
		expect(s.has("test")).toBe(true);

		// 1000ms have passed now
		await new Promise((r) => setTimeout(r, 400));
		expect(s.has("test")).toBe(false);
	});

});
