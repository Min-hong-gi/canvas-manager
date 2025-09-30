// Quadtree.ts
export interface BoundBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface HasBoundBox {
    getBoundBox(): BoundBox;
}

export class Quadtree<T extends HasBoundBox> {
    private bounds: BoundBox;
    private capacity: number;
    private objects: T[] = [];
    private largeObjects: T[] = [];
    private divided: boolean = false;

    private northeast?: Quadtree<T>;
    private northwest?: Quadtree<T>;
    private southeast?: Quadtree<T>;
    private southwest?: Quadtree<T>;

    constructor(bounds: BoundBox, capacity: number = 4) {
        this.bounds = bounds;
        this.capacity = capacity;
    }
    /**
     * 객체를 QuadTree로 관리해 더 빠르게 2차원 좌표계에서 찾을 수 있도록 합니다.
     * @param obj 관리될 객체, getBoundBox를 제공받아 소속 영역을 결정합니다.
     * @param hard getBoundBox가 전체 영역을 벗어나더라도 관리하도록 강제합니다. (약간 여유있는 box라면 모서리에서 범위를 벗어나는 경우가 있어 추가함)
     * @returns 삽입 성공 여부
     */
    insert(obj: T, hard = false): boolean {
        if (!this.#contains(obj.getBoundBox(), this.bounds)) {
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
            this.#subdivide();
        };

        const inserted = (
            this.northeast!.insert(obj) ||
            this.northwest!.insert(obj) ||
            this.southeast!.insert(obj) ||
            this.southwest!.insert(obj)
        );

        if (!inserted) {
            this.objects.push(obj);
        }

        return true;
    }

    /**
     * 객체를 QuadTree관리에서 제외합니다.
     * @param obj 관리를 그만둘 객체, 여러번 insert되었어도 한번만 제거됩니다.
     */
    remove(obj: T): void {
        const i = this.largeObjects.findIndex(x => x === obj);
        if (i != -1) {
            this.largeObjects.splice(i, 1);
            return;
        }


        if (!this.#intersects(this.bounds, obj.getBoundBox())) {
            return;
        }

        const i2 = this.objects.findIndex(x => x === obj);
        if (i2 != -1) {
            this.objects.splice(i2, 1);
        }

        if (this.divided) {
            this.northwest!.remove(obj);
            this.northeast!.remove(obj);
            this.southwest!.remove(obj);
            this.southeast!.remove(obj);
        }
    }

    /**
     * 제공된 범위 부근의 객체들을 찾습니다.
     * @param range 검색 범위
     * @returns 검색된 객체들
     */
    query(range: BoundBox):T[] {
        return this.#query(range);
    }

    /**
     * 사용자가 query에서 found를 넣는 것을 방지하기 위한 private 처리
     */
    #query(range: BoundBox, found: T[] = []): T[] {
        for (const obj of this.largeObjects) {
            if (this.#intersects(range, obj.getBoundBox())) {
                found.push(obj);
            }
        }


        if (!this.#intersects(this.bounds, range)) {
            return found;
        }

        for (const obj of this.objects) {
            if (this.#intersects(range, obj.getBoundBox())) {
                found.push(obj);
            }
        }

        if (this.divided) {
            this.northwest!.#query(range, found);
            this.northeast!.#query(range, found);
            this.southwest!.#query(range, found);
            this.southeast!.#query(range, found);
        }

        return found;
    }

    /**
     * 관리 객체들의 위치를 재계산합니다.
     */
    update() {
        const objects = this.allItems();
        this.clear();

        objects.forEach(obj => {
            this.insert(obj, true);
        })
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
     * tree를 분할합니다.
     */
    #subdivide(): void {
        const { x, y, width, height } = this.bounds;
        const halfW = width / 2;
        const halfH = height / 2;

        this.northwest = new Quadtree<T>({ x, y, width: halfW, height: halfH }, this.capacity);
        this.northeast = new Quadtree<T>({ x: x + halfW, y, width: halfW, height: halfH }, this.capacity);
        this.southwest = new Quadtree<T>({ x, y: y + halfH, width: halfW, height: halfH }, this.capacity);
        this.southeast = new Quadtree<T>({ x: x + halfW, y: y + halfH, width: halfW, height: halfH }, this.capacity);

        this.divided = true;

        // 여기서 현재 objects를 다시 자식들에게 재분배
        const olds = this.objects;
        this.objects = [];
        for (const obj of olds) {
            this.insert(obj);
        }
    }

    /**
     * 범위 a가 범위 b와 겹치는지 검사합니다.
     * @param a 겹칠 범위 a
     * @param b 겹칠 범위 b
     * @returns 겹침 여부
     */
    #intersects(a: BoundBox, b: BoundBox): boolean {
        return !(
            b.x > a.x + a.width ||
            b.x + b.width < a.x ||
            b.y > a.y + a.height ||
            b.y + b.height < a.y
        );
    }

    /**
     * 범위 a가 범위 b에 포함되는지 검사합니다.
     * @param a 포함될 범위 a
     * @param b 포함할 범위 b
     * @returns 포함 여부
     */
    #contains(a: BoundBox, b: BoundBox): boolean {
        return (
            a.x >= b.x &&
            a.y >= b.y &&
            a.x + a.width <= b.x + b.width &&
            a.y + a.height <= b.y + b.height
        );
    }

    /**
     * tree 내의 모든 객체를 반환합니다.
     * @returns tree 내 모든 객체
     */
    allItems(): T[] {
        let result = this.objects.concat(this.largeObjects);
        if (this.divided) {
            result = result
                .concat(this.northwest!.allItems())
                .concat(this.northeast!.allItems())
                .concat(this.southwest!.allItems())
                .concat(this.southeast!.allItems());
        }
        return result;
    }

    /**
     * DEBUG용, QuadTree를 시각화합니다.
     * @param ctx 표시될 캔버스의 CanvasRenderingContext2D객체
     * @param color 색상, 기본 #000
     * @default color '#000'
     */
    render(ctx: CanvasRenderingContext2D, color = '#000') {
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

        this.northeast?.render(ctx, color);
        this.northwest?.render(ctx, color);
        this.southeast?.render(ctx, color);
        this.southwest?.render(ctx, color);
    }
}
