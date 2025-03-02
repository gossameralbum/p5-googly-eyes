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
	fill(255);
	ellipse(0, 0, 50, 50);
	// Add rectangles to the top of the left eye
	fill(0);
	rect(-6.5, -35, 3, 10); // Left rectangle
	rect(3.5, -35, 3, 10); // Right rectangle
	rotate(leftAngle);
	fill(0);
	ellipse(12.5, 0, 25, 25);
	pop();

	let rightX = windowWidth / 2 + 100;
	let rightY = windowHeight / 2;

	let rightAngle = atan2(mouseY - rightY, mouseX - rightX);

	push();
	translate(rightX, rightY);
	fill(255);
	ellipse(0, 0, 50, 50);
	// Add rectangles to the top of the right eye
	fill(0);
	rect(-6.5, -35, 3, 10); // Left rectangle
	rect(3.5, -35, 3, 10); // Right rectangle
	rotate(rightAngle);
	fill(0);
	ellipse(12.5, 0, 25, 25);
	pop();
}
