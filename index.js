const range_error_message = 'ttl should be a number between 1 and Infinity';

module.exports = class SetTTL extends Set {

    #ttl_cache = new Map();
    #default_ttl= 500;
    #next_check = 0;

	set ttl(v){
		v = Number(v);
		if(!(v > 0) || !(Infinity > v)){
			throw new RangeError(range_error_message);
		}
		this.#default_ttl = Number(v);
	}

	get ttl(){
		return this.#default_ttl;
	}

    constructor(default_ttl) {
        super();

		if(default_ttl){
			this.#default_ttl = Number(default_ttl);
		}

		// sanity
		if(!(this.#default_ttl > 0) || !(Infinity > this.#default_ttl)){
			throw new RangeError(range_error_message);
		}
	}

    #checkTTL(){

        const now = new Date().getTime();


        if(now < this.#next_check){
            return;
        }

        this.#next_check = 0;
        for(const [key, value] of this.#ttl_cache){

            if(this.#next_check > value || this.#next_check === 0){
                this.#next_check = value;
            }

            if(value <= now){
                this.delete(key);
                this.#ttl_cache.delete(key);
            }

        }
    }

    add(v, ttl){
        const current = new Date().getTime();
        this.#ttl_cache.set(v, ttl ? current + ttl : current + this.#default_ttl);
        this.#next_check = 0;
        return super.add(v);
    }

    extend(v, ttl){
        const current = this.#ttl_cache.get(v);
        this.#next_check = 0;
        if(current){
            this.#ttl_cache.set(v, ttl ? current + ttl : current + this.#default_ttl);
        }
    }

    clear(){
        this.#ttl_cache = new Map();
        return super.clear();
    }

    delete(v){
        this.#ttl_cache.delete(v);
        return super.delete(v);
    }

    has(v){
        this.#checkTTL.call(this);
        return super.has(v);
    }

    values(){
        this.#checkTTL.call(this);
        return super.values();
    }

    keys(){
        this.#checkTTL.call(this);
        return super.keys();
    }

    forEach(callbackfn, thisArg){
        this.#checkTTL.call(this);
        return super.forEach(callbackfn, thisArg);
    }

    get size(){
        this.#checkTTL.call(this);
        return super.size;
    }
}


