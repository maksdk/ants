interface Vector2D {
    
}

interface Vector2DConstructor {
    new(x?: number, y?: number): Vector2D
}

interface Math {
    Vector2D: Vector2DConstructor;

    randomInt: (min: number, max: number) => number;

    randomFloat: (min: number, max: number) => number;

    randomColor: (prefix: "#0 " | "0x") => string;
}

/**
 * @class Vector2D
 */
Math.Vector2D = class Vector2D {
    private _x: number;
    private _y: number;

    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(val: number) {
        this._x = val;
    }
    get y(): number {
        return this._y;
    }

    set y(val: number) {
        this._y = val;
    }

    set({ x = this._x, y = this._y } = {}): Vector2D {
        this.x = x;
        this.y = y;
        return this;
    }

    copy(): Vector2D {
        return new Vector2D(this._x, this._y);
    }

    add({ x = 0, y = 0 } = {}): Vector2D {
        this._x += x;
        this._y += y;
        return this;
    }

    subtract({ x = 0, y = 0 } = {}): Vector2D {
        this._x -= x;
        this._y -= y;
        return this;
    }

    getDistanceTo(vector: Vector2D): number {
        return vector.copy().subtract(this).getMagnitude();
    }

    getAngleTo(vector: Vector2D): number {
        return vector.copy().subtract(this).getAngle();
    }

    multiply(val: number): Vector2D {
        this.x *= val;
        this.y *= val;
        return this;
    }

    divide(val: number): Vector2D {
        if (val === 0) {
            console.warn('can not be divided by 0');
            return this;
        }
        this.x /= val;
        this.y /= val;
        return this;
    }

    getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    setAngle(angle: number): Vector2D {
        var mag = this.getMagnitude();
        this.x = Math.cos(angle) * mag;
        this.y = Math.sin(angle) * mag;
        return this;
    }

    setLimit(max: number): Vector2D {
        var mag = this.getMagnitude();
        if (mag > max) this.multiply(1 / mag).multiply(max);
        return this;
    }

    setMagnitude(val: number): Vector2D {
        return this.normalize().multiply(val);
    }

    getMagnitude(): number {
        return Math.sqrt(this.magSqrt());
    }

    normalize(): Vector2D {
        const mag = this.getMagnitude();
        if (mag !== 0) this.multiply(1 / mag);
        return this;
    }

    magSqrt(): number {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }

    static create({ x = 0, y = 0 } = {}): Vector2D {
        return new Vector2D(x, y);
    }

    static createFromAngle(angle: number): Vector2D {
        return this.create({ x: 1, y: 1 })
            .normalize()
            .setAngle(angle);
    }

    static copyVector({ x = 0, y = 0 } = {}): Vector2D {
        return new Vector2D(x, y);
    }

    static getDirection(from: Vector2D, to: Vector2D): Vector2D {
        const angle = from.getAngleTo(to);
        const vector = Vector2D.createFromAngle(angle);
        return vector.normalize();
    }

    static getDistance(from: Vector2D, to: Vector2D): number {
        return Math.sqrt(Vector2D.getDistanceSqrt(from, to));
    }

    static getDistanceSqrt(from: Vector2D, to: Vector2D): number {
        return from.copy().subtract(to).magSqrt();
    }
}

Math.randomInt = function (min = 0, max = Number.MAX_SAFE_INTEGER): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Math.randomFloat = function (min = 0, max = 1): number {
    return (Math.random() * (max - min)) + min;
};

Math.randomColor = function (prefix = "0x"): string {
    return `${prefix}${Math.random().toString(16).slice(2, 8)}`;
};
