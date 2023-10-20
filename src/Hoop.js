class Hoop {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        let options = {
            isStatic: true
        }

        this.rimx = this.x - this.r * 3 / 2;
        this.rimy = this.y;

        this.boardx = this.x + this.r * 3 / 2;
        this.boardy = this.y - this.r * 3;

        this.outerRim = Bodies.rectangle(this.rimx, this.rimy, 1, 1, { isStatic: true });
        this.innerRim = Bodies.rectangle(this.rimx + this.r * 3, this.rimy + this.r / 12, 1, 1, { isStatic: true });
        this.board = Bodies.rectangle(this.innerRim.position.x, this.innerRim.position.y - this.r * 3 / 2, 1, this.r * 3, { isStatic: true });

        Composite.add(world, this.outerRim);
        Composite.add(world, this.innerRim);
        Composite.add(world, this.board);
    }

    show() {
        let o_rPos = this.outerRim.position;

        push();

        // Board
        strokeWeight(3);
        stroke(0);
        fill(190);
        rectMode(CENTER)
        quad(o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2 - this.r / 5,
            o_rPos.y - this.r / 5,
            o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2 + this.r * 0.75 - this.r / 5,
            o_rPos.y + this.r / 5,
            o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2 + this.r * 0.75 - this.r / 5,
            o_rPos.y - this.r * 3 + this.r / 5,
            o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2 - this.r / 5,
            o_rPos.y - this.r * 3 - this.r / 5);

        // Rim
        noFill();
        stroke(230, 105, 0);
        strokeWeight(5);
        ellipseMode(CENTER);
        ellipse(o_rPos.x + this.r * 3 / 2, o_rPos.y, this.r * 3, this.r / 2);
        pop();
    }

    showRim() {
        push()
        stroke(200, 70, 0);
        strokeWeight(5);
        noFill()
        arc(this.innerRim.position.x - this.r * 3 / 2, this.innerRim.position.y,
            this.r * 3,
            this.r / 2,
            0,
            PI,
            OPEN
        )
        pop()
    }

    showNet() {
        let o_rPos = this.outerRim.position;

        // Net
        stroke(80);
        strokeWeight(2);
        line(o_rPos.x + this.r * 3 / 2 - this.r * 3 / 2, o_rPos.y, o_rPos.x + this.r * 3 / 2 - this.r, o_rPos.y + 3 * this.r)
        line(o_rPos.x + this.r * 3 / 2 + this.r, o_rPos.y + 3 * this.r, o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2, o_rPos.y)
        line(o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2, o_rPos.y, (o_rPos.x + this.r * 3 / 2 - this.r * 3 / 2 + o_rPos.x + this.r * 3 / 2 - this.r) / 2, o_rPos.y + this.r * 3 / 2)
        line(o_rPos.x + this.r * 3 / 2 - this.r * 3 / 2, o_rPos.y, (o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2 + o_rPos.x + this.r * 3 / 2 + this.r) / 2, o_rPos.y + this.r * 3 / 2)
        line((o_rPos.x + this.r * 3 / 2 - this.r * 3 / 2 + o_rPos.x + this.r * 3 / 2 - this.r) / 2, o_rPos.y + this.r * 3 / 2, o_rPos.x + this.r * 3 / 2 + this.r, o_rPos.y + 3 * this.r)
        line((o_rPos.x + this.r * 3 / 2 + this.r * 3 / 2 + o_rPos.x + this.r * 3 / 2 + this.r) / 2, o_rPos.y + this.r * 3 / 2, o_rPos.x + this.r * 3 / 2 - this.r, o_rPos.y + 3 * this.r)
        stroke(0)
        strokeWeight(1);
    }

    mouseInHoop() {
        // Outer hoop
        let o_dist = dist(this.outerRim.position.x, this.outerRim.position.y, mouseX, mouseY)

        // Inner hoop
        let i_dist = dist(this.innerRim.position.x, this.innerRim.position.y, mouseX, mouseY)

        // Board
        let b_dist = dist(this.board.position.x, this.board.position.y, mouseX, mouseY)

        return (o_dist <= this.r / 2) || (i_dist <= this.r / 2) || (b_dist <= this.r * 3 / 2)
    }
}