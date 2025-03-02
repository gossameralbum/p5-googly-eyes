let flock;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255);

	flock = new Flock();

	for (let i = 0; i < 100; i++) {
		let b = new Boid(width / 2, height / 2);
		flock.addBoid(b);
	}

	describe(
		"A group of bird-like objects, represented by triangles, moving across the canvas, modeling flocking behavior."
	);
}

function draw() {
	background(227, 20, 110);
	let leftX = windowWidth / 2 - 100;
	let leftY = windowHeight / 2;

	let leftAngle = atan2(mouseY - leftY, mouseX - leftX);

	push();
	translate(leftX, leftY);
	push();
	translate(-6.5, -33);
	rotate(-35);
	fill(0);
	noStroke();
	rect(0, -10, 3, 10);
	pop();
	push();
	translate(3.5, -33);
	rotate(-35);
	fill(0);
	noStroke();
	rect(0, -10, 3, 10);
	pop();
	fill(255);
	stroke(255);
	ellipse(0, 0, 50, 50);
	rotate(leftAngle);
	fill(0);
	noStroke();
	ellipse(12.5, 0, 25, 25);
	pop();

	let rightX = windowWidth / 2 + 100;
	let rightY = windowHeight / 2;

	let rightAngle = atan2(mouseY - rightY, mouseX - rightX);

	push();
	translate(rightX, rightY);
	push();
	translate(-0.5, -33);
	rotate(35);
	fill(0);
	noStroke();
	rect(0, -10, 3, 10);
	pop();
	push();
	translate(9.5, -33);
	rotate(35);
	fill(0);
	noStroke();
	rect(0, -10, 3, 10);
	pop();
	fill(255);
	stroke(255);
	ellipse(0, 0, 50, 50);
	rotate(rightAngle);
	fill(0);
	noStroke();
	ellipse(12.5, 0, 25, 25);
	pop();

	flock.run();
}

function mouseDragged() {
	flock.addBoid(new Boid(mouseX, mouseY));
}

class Flock {
	constructor() {
		this.boids = [];
	}

	run() {
		for (let boid of this.boids) {
			boid.run(this.boids);
		}
	}

	addBoid(b) {
		this.boids.push(b);
	}
}

class Boid {
	constructor(x, y) {
		this.acceleration = createVector(0, 0);
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.position = createVector(x, y);
		this.size = 3.0;

		this.maxSpeed = 3;

		this.maxForce = 0.05;
		colorMode(RGB, 255, 255, 255);
		this.color = color(random(255), random(255), random(255));
	}

	run(boids) {
		this.flock(boids);
		this.update();
		this.borders();
		this.render();
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	flock(boids) {
		let separation = this.separate(boids);
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let avoidEyes = this.avoidEyes();

		separation.mult(1.5);
		alignment.mult(1.0);
		cohesion.mult(1.0);
		avoidEyes.mult(2.0);
		this.applyForce(separation);
		this.applyForce(alignment);
		this.applyForce(cohesion);
		this.applyForce(avoidEyes);
	}

	avoidEyes() {
		let avoidRadius = 100;
		let steer = createVector(0, 0);
		let eyes = [
			createVector(windowWidth / 2 - 100, windowHeight / 2),
			createVector(windowWidth / 2 + 100, windowHeight / 2),
		];

		for (let eye of eyes) {
			let d = p5.Vector.dist(this.position, eye);
			if (d < avoidRadius) {
				let diff = p5.Vector.sub(this.position, eye);
				diff.normalize();
				diff.div(d);
				steer.add(diff);
			}
		}

		if (steer.mag() > 0) {
			steer.normalize();
			steer.mult(this.maxSpeed);
			steer.sub(this.velocity);
			steer.limit(this.maxForce);
		}

		return steer;
	}

	update() {
		this.velocity.add(this.acceleration);

		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);

		this.acceleration.mult(0);
	}

	seek(target) {
		let desired = p5.Vector.sub(target, this.position);

		desired.normalize();
		desired.mult(this.maxSpeed);

		let steer = p5.Vector.sub(desired, this.velocity);

		steer.limit(this.maxForce);
		return steer;
	}

	render() {
		let theta = this.velocity.heading() + radians(90);
		fill(this.color);
		noStroke();
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);
		beginShape();
		vertex(0, -this.size * 2);
		vertex(-this.size, this.size * 2);
		vertex(this.size, this.size * 2);
		endShape(CLOSE);
		pop();
	}

	// Wraparound
	borders() {
		if (this.position.x < -this.size) {
			this.position.x = width + this.size;
		}

		if (this.position.y < -this.size) {
			this.position.y = height + this.size;
		}

		if (this.position.x > width + this.size) {
			this.position.x = -this.size;
		}

		if (this.position.y > height + this.size) {
			this.position.y = -this.size;
		}
	}

	separate(boids) {
		let desiredSeparation = 25.0;
		let steer = createVector(0, 0);
		let count = 0;

		for (let boid of boids) {
			let distanceToNeighbor = p5.Vector.dist(this.position, boid.position);

			if (distanceToNeighbor > 0 && distanceToNeighbor < desiredSeparation) {
				let diff = p5.Vector.sub(this.position, boid.position);
				diff.normalize();

				diff.div(distanceToNeighbor);
				steer.add(diff);

				count++;
			}
		}

		if (count > 0) {
			steer.div(count);
		}

		if (steer.mag() > 0) {
			steer.normalize();
			steer.mult(this.maxSpeed);
			steer.sub(this.velocity);
			steer.limit(this.maxForce);
		}
		return steer;
	}

	align(boids) {
		let neighborDistance = 50;
		let sum = createVector(0, 0);
		let count = 0;
		for (let i = 0; i < boids.length; i++) {
			let d = p5.Vector.dist(this.position, boids[i].position);
			if (d > 0 && d < neighborDistance) {
				sum.add(boids[i].velocity);
				count++;
			}
		}
		if (count > 0) {
			sum.div(count);
			sum.normalize();
			sum.mult(this.maxSpeed);
			let steer = p5.Vector.sub(sum, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		} else {
			return createVector(0, 0);
		}
	}

	cohesion(boids) {
		let neighborDistance = 50;
		let sum = createVector(0, 0);
		let count = 0;
		for (let i = 0; i < boids.length; i++) {
			let d = p5.Vector.dist(this.position, boids[i].position);
			if (d > 0 && d < neighborDistance) {
				sum.add(boids[i].position);
				count++;
			}
		}
		if (count > 0) {
			sum.div(count);
			return this.seek(sum);
		} else {
			return createVector(0, 0);
		}
	}
}

angleMode(DEGREES);
