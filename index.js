module.exports = class SetTTL extends Set {

    #ttl_cache = new Map();
    default_ttl= 0;
    #next_check = 0;

    constructor(default_ttl) {
        super();
        this.default_ttl = Number(default_ttl);
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
        this.#ttl_cache.set(v, ttl ? current + ttl : current + this.default_ttl);
        return super.add(v);
    }

    extend(v, ttl){
        const current = this.#ttl_cache.get(v);
        if(current){
            this.#ttl_cache.set(v, ttl ? current + ttl : current + this.default_ttl);
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


