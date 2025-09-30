var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Quadtree_instances, _a, _Quadtree_subdivide, _Quadtree_intersects;
export class Quadtree {
    constructor(bounds, capacity = 4) {
        _Quadtree_instances.add(this);
        this.objects = [];
        this.largeObjects = [];
        this.divided = false;
        this.bounds = bounds;
        this.capacity = capacity;
    }
    insert(obj) {
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
        // 자식 노드 중 들어갈 수 있는 곳 재귀 삽입
        return (this.northeast.insert(obj) ||
            this.northwest.insert(obj) ||
            this.southeast.insert(obj) ||
            this.southwest.insert(obj));
    }
    remove(obj) {
        var _b, _c, _d, _e;
        const index = this.objects.indexOf(obj);
        if (index != -1) {
            this.objects.splice(index, 1);
        }
        const index2 = this.largeObjects.indexOf(obj);
        if (index2 != -1) {
            this.largeObjects.splice(index, 1);
        }
        (_b = this.northeast) === null || _b === void 0 ? void 0 : _b.remove(obj);
        (_c = this.northwest) === null || _c === void 0 ? void 0 : _c.remove(obj);
        (_d = this.southeast) === null || _d === void 0 ? void 0 : _d.remove(obj);
        (_e = this.southwest) === null || _e === void 0 ? void 0 : _e.remove(obj);
    }
    query(range, found = []) {
        if (!__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_intersects).call(this, this.bounds, range)) {
            return found;
        }
        for (const obj of this.largeObjects) {
            found.push(obj);
        }
        for (const obj of this.objects) {
            if (__classPrivateFieldGet(this, _Quadtree_instances, "m", _Quadtree_intersects).call(this, range, obj.getBoundBox())) {
                found.push(obj);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }
        return found;
    }
    update() {
        const objects = this.allItems();
        this.clear();
        objects.forEach(obj => {
            this.insert(obj);
        });
    }
    clear() {
        this.objects = [];
        this.divided = false;
        this.northeast = this.northwest = this.southeast = this.southwest = undefined;
    }
    allItems() {
        if (this.divided) {
            const northwestArr = this.northwest ? this.northwest.allItems() : [];
            const northeastArr = this.northeast ? this.northeast.allItems() : [];
            const southeastArr = this.southeast ? this.southeast.allItems() : [];
            const southwestArr = this.southwest ? this.southwest.allItems() : [];
            return northwestArr.concat(northeastArr).concat(southeastArr).concat(southwestArr);
        }
        return this.objects.concat(this.largeObjects);
    }
}
_a = Quadtree, _Quadtree_instances = new WeakSet(), _Quadtree_subdivide = function _Quadtree_subdivide() {
    const { x, y, width, height } = this.bounds;
    const halfW = width / 2;
    const halfH = height / 2;
    this.northwest = new _a({ x, y, width: halfW, height: halfH }, this.capacity);
    this.northeast = new _a({ x: x + halfW, y, width: halfW, height: halfH }, this.capacity);
    this.southwest = new _a({ x, y: y + halfH, width: halfW, height: halfH }, this.capacity);
    this.southeast = new _a({ x: x + halfW, y: y + halfH, width: halfW, height: halfH }, this.capacity);
    this.divided = true;
    // 여기서 현재 objects를 다시 자식들에게 재분배
    for (const obj of this.objects) {
        this.insert(obj);
    }
    this.objects = [];
}, _Quadtree_intersects = function _Quadtree_intersects(a, b) {
    return !(b.x > a.x + a.width ||
        b.x + b.width < a.x ||
        b.y > a.y + a.height ||
        b.y + b.height < a.y);
};
