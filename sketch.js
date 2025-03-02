function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(RGB, 255, 255, 255);
}

angleMode(DEGREES);

describe("Two eyes that follow the cursor in front of a purple background.");

function draw() {
	background(80, 0, 179);

	let leftX = windowWidth / 2 - 100;
	let leftY = windowHeight / 2;

	let leftAngle = atan2(mouseY - leftY, mouseX - leftX);

	push();
	translate(leftX, leftY);
	// Add rectangles to the top of the left eye
	push();
	translate(-6.5, -33); // Move 3 pixels upwards
	rotate(-35);
	fill(0);
	noStroke();
	rect(0, -10, 3, 10); // Left rectangle
	pop();
	push();
	translate(3.5, -33); // Move 3 pixels upwards
	rotate(-35);
	fill(0);
	noStroke();
	rect(0, -10, 3, 10); // Right rectangle
	pop();
	fill(255);
	stroke(255); // Change border color to white
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
	// Add rectangles to the top of the right eye
	push();
	translate(-0.5, -33); // Move 6 pixels to the right
	rotate(35); // Lean right 35 degrees
	fill(0);
	noStroke();
	rect(0, -10, 3, 10); // Left rectangle
	pop();
	push();
	translate(9.5, -33); // Move 6 pixels to the right
	rotate(35); // Lean right 35 degrees
	fill(0);
	noStroke();
	rect(0, -10, 3, 10); // Right rectangle
	pop();
	// Draw the ellipse
	fill(255);
	stroke(255); // Change border color to white
	ellipse(0, 0, 50, 50);
	rotate(rightAngle);
	fill(0);
	noStroke();
	ellipse(12.5, 0, 25, 25);
	pop();
}
