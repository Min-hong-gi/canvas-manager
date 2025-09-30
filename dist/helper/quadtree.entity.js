var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Quadtree_instances, _a, _Quadtree_query, _Quadtree_subdivide, _Quadtree_intersects, _Quadtree_contains;
export class Quadtree {
    constructor(bounds, capacity = 4) {
        _Quadtree_instances.add(this);
        this.objects = [];
        this.largeObjects = [];
        this.divided = false;
        this.bounds = bounds;
        this.capacity = capacity;
    }
    /**
     * 객체를 QuadTree로 관리해 더 빠르게 2차원 좌표계에서 찾을 수 있도록 합니다.
     * @param obj 관리될 객체, getBoundBox를 제공받아 소속 영역을 결정합니다.
     * @param hard getBoundBox가 전체 영역을 벗어나더라도 관리하도록 강제합니다. (약간 여유있는 box라면 모서리에서 범위를 벗어나는 경우가 있어 추가함)
     * @returns 삽입 성공 여부
     */
    insert(obj, hard = false) {
        if (!__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_contains).call(this, obj.getBoundBox(), this.bounds)) {
            if (hard) {
                this.largeObjects.push(obj);
                return true;
            }
            return false;
        }
        if (obj.getBoundBox().width > this.bounds.width || obj.getBoundBox().height > this.bounds.height) {
            // 큰 객체는 이 노드 largeObjects에 보관
            this.largeObjects.push(obj);
            return true;
        }
        if (!this.divided && this.objects.length < this.capacity) {
            this.objects.push(obj);
            return true;
        }
        if (!this.divided) {
            __classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_subdivide).call(this);
        }
        ;
        const inserted = (this.northeast.insert(obj) ||
            this.northwest.insert(obj) ||
            this.southeast.insert(obj) ||
            this.southwest.insert(obj));
        if (!inserted) {
            this.objects.push(obj);
        }
        return true;
    }
    /**
     * 객체를 QuadTree관리에서 제외합니다.
     * @param obj 관리를 그만둘 객체, 여러번 insert되었어도 한번만 제거됩니다.
     */
    remove(obj) {
        const i = this.largeObjects.findIndex(x => x === obj);
        if (i != -1) {
            this.largeObjects.splice(i, 1);
            return;
        }
        if (!__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_intersects).call(this, this.bounds, obj.getBoundBox())) {
            return;
        }
        const i2 = this.objects.findIndex(x => x === obj);
        if (i2 != -1) {
            this.objects.splice(i2, 1);
        }
        if (this.divided) {
            this.northwest.remove(obj);
            this.northeast.remove(obj);
            this.southwest.remove(obj);
            this.southeast.remove(obj);
        }
    }
    /**
     * 제공된 범위 부근의 객체들을 찾습니다.
     * @param range 검색 범위
     * @returns 검색된 객체들
     */
    query(range) {
        return __classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_query).call(this, range);
    }
    /**
     * 관리 객체들의 위치를 재계산합니다.
     */
    update() {
        const objects = this.allItems();
        this.clear();
        objects.forEach(obj => {
            this.insert(obj, true);
        });
    }
    /**
     * 모든 관리를 제거하고 Tree를 비웁니다.
     */
    clear() {
        this.objects = [];
        this.largeObjects = [];
        this.divided = false;
        this.northeast = this.northwest = this.southeast = this.southwest = undefined;
    }
    /**
     * tree 내의 모든 객체를 반환합니다.
     * @returns tree 내 모든 객체
     */
    allItems() {
        let result = this.objects.concat(this.largeObjects);
        if (this.divided) {
            result = result
                .concat(this.northwest.allItems())
                .concat(this.northeast.allItems())
                .concat(this.southwest.allItems())
                .concat(this.southeast.allItems());
        }
        return result;
    }
    /**
     * DEBUG용, QuadTree를 시각화합니다.
     * @param ctx 표시될 캔버스의 CanvasRenderingContext2D객체
     * @param color 색상, 기본 #000
     * @default color '#000'
     */
    render(ctx, color = '#000') {
        var _b, _c, _d, _e;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.closePath();
        this.largeObjects.forEach(element => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.strokeRect(element.getBoundBox().x, element.getBoundBox().y, element.getBoundBox().width, element.getBoundBox().height);
            ctx.closePath();
        });
        this.objects.forEach(element => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.strokeRect(element.getBoundBox().x, element.getBoundBox().y, element.getBoundBox().width, element.getBoundBox().height);
            ctx.closePath();
        });
        (_b = this.northeast) === null || _b === void 0 ? void 0 : _b.render(ctx, color);
        (_c = this.northwest) === null || _c === void 0 ? void 0 : _c.render(ctx, color);
        (_d = this.southeast) === null || _d === void 0 ? void 0 : _d.render(ctx, color);
        (_e = this.southwest) === null || _e === void 0 ? void 0 : _e.render(ctx, color);
    }
}
_a = Quadtree, _Quadtree_instances = new WeakSet(), _Quadtree_query = function _Quadtree_query(range, found = []) {
    var _b, _c, _d, _e;
    for (const obj of this.largeObjects) {
        if (__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_intersects).call(this, range, obj.getBoundBox())) {
            found.push(obj);
        }
    }
    if (!__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_intersects).call(this, this.bounds, range)) {
        return found;
    }
    for (const obj of this.objects) {
        if (__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_intersects).call(this, range, obj.getBoundBox())) {
            found.push(obj);
        }
    }
    if (this.divided) {
        __classPrivateFieldGet((_b = this.northwest), _Quadtree_instances, "m", _Quadtree_query).call(_b, range, found);
        __classPrivateFieldGet((_c = this.northeast), _Quadtree_instances, "m", _Quadtree_query).call(_c, range, found);
        __classPrivateFieldGet((_d = this.southwest), _Quadtree_instances, "m", _Quadtree_query).call(_d, range, found);
        __classPrivateFieldGet((_e = this.southeast), _Quadtree_instances, "m", _Quadtree_query).call(_e, range, found);
    }
    return found;
}, _Quadtree_subdivide = function _Quadtree_subdivide() {
    const { x, y, width, height } = this.bounds;
    const halfW = width / 2;
    const halfH = height / 2;
    this.northwest = new _a({ x, y, width: halfW, height: halfH }, this.capacity);
    this.northeast = new _a({ x: x + halfW, y, width: halfW, height: halfH }, this.capacity);
    this.southwest = new _a({ x, y: y + halfH, width: halfW, height: halfH }, this.capacity);
    this.southeast = new _a({ x: x + halfW, y: y + halfH, width: halfW, height: halfH }, this.capacity);
    this.divided = true;
    // 여기서 현재 objects를 다시 자식들에게 재분배
    const olds = this.objects;
    this.objects = [];
    for (const obj of olds) {
        this.insert(obj);
    }
}, _Quadtree_intersects = function _Quadtree_intersects(a, b) {
    return !(b.x > a.x + a.width ||
        b.x + b.width < a.x ||
        b.y > a.y + a.height ||
        b.y + b.height < a.y);
}, _Quadtree_contains = function _Quadtree_contains(a, b) {
    return (a.x >= b.x &&
        a.y >= b.y &&
        a.x + a.width <= b.x + b.width &&
        a.y + a.height <= b.y + b.height);
};
