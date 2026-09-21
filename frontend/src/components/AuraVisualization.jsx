// import React from "react";
// import Sketch from "react-p5";

// let buildings = [];
// let trees = [];
// let leaves = [];
// let raindrops = [];
// let lightningFlashes = [];
// let clouds = [];
// let birds = [];
// let time = 0;
// let currentSentiment = 0;
// let sunY = 0;
// let targetSunY = 0;
// let loadingProgress = 0;
// let isLoading = true;

// class DetailedBuilding {
//   constructor(p5, x, width, height, depth, type) {
//     this.x = x;
//     this.width = width;
//     this.height = height;
//     this.depth = depth;
//     this.baseY = p5.height * 0.7;
//     this.type = type;

//     this.actualWidth = width * (0.6 + depth * 0.4);
//     this.actualHeight = height * (0.7 + depth * 0.3);

//     this.windowWidth = 8;
//     this.windowHeight = 12;
//     this.windowSpacingX = 14;
//     this.windowSpacingY = 20;
//     this.cols = Math.floor(this.actualWidth / this.windowSpacingX);
//     this.rows = Math.floor(this.actualHeight / this.windowSpacingY);

//     this.windowPattern = [];
//     for (let i = 0; i < this.rows * this.cols; i++) {
//       this.windowPattern.push({
//         lit: p5.random() > 0.4,
//         flicker: p5.random(0.8, 1.2),
//         flickerSpeed: p5.random(0.5, 2),
//       });
//     }

//     this.hasSpire = this.type === "skyscraper" && p5.random() > 0.5;
//     this.hasAntenna = this.type === "skyscraper" && p5.random() > 0.6;
//     this.roofStyle = Math.floor(p5.random(3));
//     this.accentColor = p5.random(["blue", "red", "green", "white"]);

//     this.sections = [];
//     let currentHeight = 0;
//     while (currentHeight < this.actualHeight) {
//       const sectionHeight = p5.random(
//         this.actualHeight * 0.2,
//         this.actualHeight * 0.4
//       );
//       const sectionWidth = this.actualWidth * p5.random(0.85, 1);
//       this.sections.push({
//         height: Math.min(sectionHeight, this.actualHeight - currentHeight),
//         width: sectionWidth,
//         offset: (this.actualWidth - sectionWidth) / 2,
//       });
//       currentHeight += sectionHeight;
//     }
//   }

//   draw(p5, sentiment, timeOfDay) {
//     p5.push();

//     let buildingHue = 220;
//     let buildingSat = p5.map(sentiment, -1, 1, 8, 18);
//     let buildingBright = p5.map(sentiment, -1, 1, 18, 38);

//     buildingBright *= timeOfDay;
//     buildingSat *= 1 - this.depth * 0.3;
//     buildingBright = p5.lerp(buildingBright, 60, this.depth * 0.4);

//     let yPos = this.baseY - this.actualHeight;

//     this.sections.forEach((section, idx) => {
//       const sectionBright = buildingBright + (idx % 2) * 2;
//       p5.fill(buildingHue, buildingSat, sectionBright);
//       p5.stroke(buildingHue, buildingSat, sectionBright - 10);
//       p5.strokeWeight(1 + this.depth);

//       const sectionX = this.x + section.offset;
//       p5.rect(sectionX, yPos, section.width, section.height);

//       if (this.depth > 0.5) {
//         p5.fill(buildingHue, buildingSat, sectionBright - 8);
//         p5.beginShape();
//         p5.vertex(sectionX + section.width, yPos);
//         p5.vertex(sectionX + section.width + 8, yPos + 5);
//         p5.vertex(sectionX + section.width + 8, yPos + section.height + 5);
//         p5.vertex(sectionX + section.width, yPos + section.height);
//         p5.endShape(p5.CLOSE);
//       }

//       yPos += section.height;
//     });

//     this.drawWindows(p5, sentiment, timeOfDay, buildingHue);
//     this.drawRoof(p5, sentiment, timeOfDay, buildingBright);

//     if (this.depth > 0.6) {
//       this.drawAccents(p5, sentiment);
//     }

//     p5.pop();
//   }

//   drawWindows(p5, sentiment, timeOfDay, buildingHue) {
//     const glowIntensity = p5.map(timeOfDay, 0.3, 1, 1, 0.3);

//     for (let row = 0; row < this.rows; row++) {
//       for (let col = 0; col < this.cols; col++) {
//         const idx = row * this.cols + col;
//         if (idx >= this.windowPattern.length) continue;

//         const window = this.windowPattern[idx];
//         if (!window.lit) continue;

//         const wx = this.x + col * this.windowSpacingX + 3;
//         const wy =
//           this.baseY - this.actualHeight + row * this.windowSpacingY + 4;

//         const flicker =
//           p5.noise(idx * 0.1, time * window.flickerSpeed) * 0.2 + 0.8;

//         let windowHue = 50;
//         let windowSat = 30;
//         let windowBright =
//           p5.map(sentiment, -1, 1, 50, 85) * glowIntensity * flicker;

//         if (this.depth > 0.7 && windowBright > 60) {
//           p5.fill(windowHue, windowSat - 10, windowBright + 10, 100);
//           p5.noStroke();
//           p5.rect(wx - 2, wy - 2, this.windowWidth + 4, this.windowHeight + 4);
//         }

//         p5.fill(windowHue, windowSat, windowBright);
//         p5.noStroke();
//         p5.rect(wx, wy, this.windowWidth, this.windowHeight);

//         p5.fill(
//           windowHue,
//           windowSat - 20,
//           Math.min(100, windowBright + 15),
//           150
//         );
//         p5.rect(wx, wy, this.windowWidth, this.windowHeight * 0.4);

//         p5.stroke(buildingHue, 10, 25);
//         p5.strokeWeight(0.5);
//         p5.noFill();
//         p5.rect(wx, wy, this.windowWidth, this.windowHeight);
//       }
//     }
//   }

//   drawRoof(p5, sentiment, timeOfDay, buildingBright) {
//     const roofY = this.baseY - this.actualHeight;

//     p5.stroke(220, 10, buildingBright - 10);
//     p5.strokeWeight(1);

//     if (this.roofStyle === 0) {
//       p5.fill(220, 15, buildingBright + 5);
//       p5.rect(this.x, roofY - 8, this.actualWidth, 8);

//       if (this.depth > 0.6) {
//         p5.fill(220, 10, buildingBright - 5);
//         p5.rect(this.x + 10, roofY - 15, 15, 7);
//         p5.rect(this.x + this.actualWidth - 25, roofY - 15, 15, 7);
//       }
//     } else if (this.roofStyle === 1) {
//       p5.fill(220, 15, buildingBright + 3);
//       p5.triangle(
//         this.x,
//         roofY,
//         this.x + this.actualWidth / 2,
//         roofY - 20,
//         this.x + this.actualWidth,
//         roofY
//       );
//     }

//     if (this.hasSpire) {
//       p5.fill(220, 20, buildingBright + 10);
//       p5.triangle(
//         this.x + this.actualWidth / 2 - 5,
//         roofY,
//         this.x + this.actualWidth / 2,
//         roofY - 40,
//         this.x + this.actualWidth / 2 + 5,
//         roofY
//       );

//       const spireLight = p5.map(sentiment, -1, 1, 50, 90);
//       p5.fill(this.accentColor === "red" ? 0 : 220, 80, spireLight);
//       p5.noStroke();
//       p5.ellipse(this.x + this.actualWidth / 2, roofY - 40, 6, 6);
//     }

//     if (this.hasAntenna) {
//       p5.stroke(0, 0, buildingBright + 15);
//       p5.strokeWeight(2);
//       p5.line(
//         this.x + this.actualWidth / 2,
//         roofY - 5,
//         this.x + this.actualWidth / 2,
//         roofY - 60
//       );

//       p5.fill(0, 90, 60);
//       p5.noStroke();
//       if (p5.frameCount % 60 < 30) {
//         p5.ellipse(this.x + this.actualWidth / 2, roofY - 60, 4, 4);
//       }
//     }
//   }

//   drawAccents(p5, sentiment) {
//     const entranceY = this.baseY - 30;
//     p5.fill(220, 25, 15);
//     p5.rect(
//       this.x + this.actualWidth * 0.3,
//       entranceY,
//       this.actualWidth * 0.4,
//       30
//     );

//     p5.fill(50, 40, 70);
//     p5.noStroke();
//     p5.ellipse(this.x + this.actualWidth / 2, entranceY + 15, 8, 8);

//     if (p5.random() > 0.7) {
//       p5.fill(this.accentColor === "blue" ? 220 : 0, 70, 70);
//       p5.rect(
//         this.x + this.actualWidth * 0.4,
//         this.baseY - this.actualHeight + 20,
//         this.actualWidth * 0.2,
//         4
//       );
//     }
//   }
// }

// class DetailedTree {
//   constructor(p5, x, depth) {
//     this.x = x;
//     this.depth = depth;
//     this.scale = 0.7 + depth * 0.3;
//     this.baseY = p5.height * 0.7;
//     this.trunkHeight = (50 + p5.random(-10, 15)) * this.scale;
//     this.trunkWidth = (10 + p5.random(-2, 3)) * this.scale;
//     this.canopyRadius = (40 + p5.random(-8, 10)) * this.scale;
//     this.swayOffset = p5.random(p5.TWO_PI);

//     this.branches = [];
//     const branchCount = Math.floor(5 + p5.random(3));
//     for (let i = 0; i < branchCount; i++) {
//       const angle = p5.random(-p5.PI / 4, p5.PI / 4);
//       const length = p5.random(15, 30) * this.scale;
//       const startHeight = p5.random(0.4, 0.9) * this.trunkHeight;
//       this.branches.push({ angle, length, startHeight });
//     }

//     this.leafClusters = [];
//     for (let i = 0; i < 12; i++) {
//       const angle = (i / 12) * p5.TWO_PI;
//       const distance = p5.random(0.6, 1) * this.canopyRadius;
//       this.leafClusters.push({ angle, distance, size: p5.random(0.8, 1.2) });
//     }
//   }

//   draw(p5, sentiment, timeOfDay) {
//     p5.push();

//     const windStrength = Math.abs(sentiment) * 2;
//     const sway = p5.sin(time * 2 + this.swayOffset) * windStrength;

//     p5.translate(this.x + sway, this.baseY);

//     let trunkHue = 25;
//     let trunkSat = 45;
//     let trunkBright = p5.map(sentiment, -1, 1, 18, 28) * timeOfDay;

//     trunkBright = p5.lerp(trunkBright, 50, this.depth * 0.3);

//     p5.fill(trunkHue, trunkSat, trunkBright);
//     p5.stroke(trunkHue, trunkSat, trunkBright - 8);
//     p5.strokeWeight(1);
//     p5.rect(
//       -this.trunkWidth / 2,
//       -this.trunkHeight,
//       this.trunkWidth,
//       this.trunkHeight
//     );

//     for (let i = 0; i < 5; i++) {
//       const y = -this.trunkHeight + (i / 5) * this.trunkHeight;
//       p5.stroke(trunkHue, trunkSat - 10, trunkBright + 5, 100);
//       p5.line(-this.trunkWidth / 2 + 2, y, this.trunkWidth / 2 - 2, y);
//     }

//     this.branches.forEach((branch) => {
//       const startY = -branch.startHeight;
//       const endX = p5.cos(branch.angle) * branch.length;
//       const endY = startY + p5.sin(branch.angle) * branch.length * 0.5;

//       p5.stroke(trunkHue, trunkSat, trunkBright - 5);
//       p5.strokeWeight(3 * this.scale);
//       p5.line(0, startY, endX, endY);
//     });

//     let canopyHue, canopySat, canopyBright;
//     if (sentiment < -0.3) {
//       canopyHue = p5.map(sentiment, -1, -0.3, 25, 45);
//       canopySat = 65;
//       canopyBright = 40 * timeOfDay;
//     } else if (sentiment < 0.2) {
//       canopyHue = 65;
//       canopySat = 60;
//       canopyBright = 55 * timeOfDay;
//     } else {
//       canopyHue = p5.map(sentiment, 0.2, 1, 85, 125);
//       canopySat = 70;
//       canopyBright = 60 * timeOfDay;
//     }

//     canopyBright = p5.lerp(canopyBright, 65, this.depth * 0.25);

//     for (let layer = 2; layer >= 0; layer--) {
//       const layerSize = this.canopyRadius * (1 + layer * 0.15);
//       const layerBright = canopyBright - layer * 8;

//       p5.fill(canopyHue, canopySat, layerBright, 180);
//       p5.noStroke();
//       p5.ellipse(0, -this.trunkHeight, layerSize * 2, layerSize * 1.8);
//     }

//     this.leafClusters.forEach((cluster) => {
//       const cx = p5.cos(cluster.angle) * cluster.distance;
//       const cy =
//         -this.trunkHeight + p5.sin(cluster.angle) * cluster.distance * 0.8;
//       const clusterSize = 15 * cluster.size * this.scale;

//       p5.fill(
//         canopyHue + p5.random(-10, 10),
//         canopySat,
//         canopyBright + p5.random(-5, 5),
//         200
//       );
//       p5.ellipse(cx, cy, clusterSize);
//     });

//     p5.pop();
//   }

//   getLeafPositions(p5) {
//     const positions = [];
//     const windStrength = Math.abs(currentSentiment) * 2;
//     const sway = p5.sin(time * 2 + this.swayOffset) * windStrength;

//     this.leafClusters.forEach((cluster) => {
//       const cx =
//         this.x + sway + p5.cos(cluster.angle) * cluster.distance * this.scale;
//       const cy =
//         this.baseY -
//         this.trunkHeight +
//         p5.sin(cluster.angle) * cluster.distance * 0.8 * this.scale;
//       positions.push({ x: cx, y: cy });
//     });

//     return positions;
//   }
// }

// class Leaf {
//   constructor(p5, x, y, treeX, treeY) {
//     this.x = x;
//     this.y = y;
//     this.treeX = treeX;
//     this.treeY = treeY;
//     this.size = p5.random(6, 12);
//     this.rotation = p5.random(p5.TWO_PI);
//     this.rotSpeed = p5.random(-0.05, 0.05);
//     this.swayOffset = p5.random(p5.TWO_PI);
//     this.opacity = 0;
//     this.growing = true;
//     this.growProgress = 0;
//     this.falling = false;
//     this.fallSpeed = 0;
//     this.offsetX = p5.random(-25, 25);
//     this.offsetY = p5.random(-25, 25);
//   }

//   update(p5, windStrength) {
//     if (this.growing) {
//       this.growProgress += 0.03;
//       if (this.growProgress >= 1) {
//         this.growing = false;
//         this.growProgress = 1;
//       }
//       const targetX = this.treeX + this.offsetX;
//       const targetY = this.treeY + this.offsetY;
//       this.x = p5.lerp(this.treeX, targetX, p5.easeOutCubic(this.growProgress));
//       this.y = p5.lerp(this.treeY, targetY, p5.easeOutCubic(this.growProgress));
//       this.opacity = this.growProgress * 255;
//     } else if (this.falling) {
//       this.fallSpeed += 0.1;
//       this.y += this.fallSpeed;
//       this.x += p5.sin(this.y * 0.04 + this.swayOffset) * 3;
//       this.rotation += this.rotSpeed * 3;
//       this.opacity -= 2;
//     } else {
//       const sway = p5.sin(time * 2 + this.swayOffset) * windStrength * 3;
//       this.x = this.treeX + this.offsetX + sway;
//       this.y = this.treeY + this.offsetY + p5.sin(time + this.swayOffset) * 2;
//       this.rotation += this.rotSpeed;
//     }
//   }

//   draw(p5, sentiment) {
//     p5.push();
//     p5.translate(this.x, this.y);
//     p5.rotate(this.rotation);

//     let leafHue, leafSat, leafBright;
//     if (sentiment < -0.3) {
//       leafHue = p5.map(sentiment, -1, -0.3, 18, 42);
//       leafSat = 75;
//       leafBright = 48;
//     } else if (sentiment < 0.2) {
//       leafHue = 62;
//       leafSat = 65;
//       leafBright = 62;
//     } else {
//       leafHue = p5.map(sentiment, 0.2, 1, 85, 128);
//       leafSat = 78;
//       leafBright = 68;
//     }

//     p5.fill(leafHue, leafSat, leafBright, this.opacity);
//     p5.noStroke();
//     p5.ellipse(0, 0, this.size * 1.6, this.size);

//     p5.stroke(leafHue, leafSat, leafBright - 15, this.opacity * 0.6);
//     p5.strokeWeight(1);
//     p5.line(0, -this.size * 0.6, 0, this.size * 0.6);

//     p5.fill(leafHue, leafSat - 15, leafBright + 12, this.opacity * 0.5);
//     p5.noStroke();
//     p5.ellipse(
//       -this.size * 0.25,
//       -this.size * 0.2,
//       this.size * 0.5,
//       this.size * 0.3
//     );

//     p5.pop();
//   }

//   isDead(p5) {
//     return this.falling && (this.y > p5.height || this.opacity <= 0);
//   }
// }

// class Raindrop {
//   constructor(p5) {
//     this.x = p5.random(p5.width);
//     this.y = p5.random(-200, -50);
//     this.speed = p5.random(15, 25);
//     this.length = p5.random(15, 35);
//     this.opacity = p5.random(120, 220);
//     this.thickness = p5.random(1.5, 3);
//   }

//   update() {
//     this.y += this.speed;
//     this.speed += 0.2;
//   }

//   draw(p5) {
//     p5.stroke(200, 15, 75, this.opacity);
//     p5.strokeWeight(this.thickness);
//     p5.line(this.x, this.y, this.x - 2, this.y + this.length);

//     if (this.y > p5.height * 0.7 - 5 && this.y < p5.height * 0.7 + 5) {
//       p5.stroke(200, 15, 75, this.opacity * 0.5);
//       p5.strokeWeight(1);
//       for (let i = 0; i < 3; i++) {
//         const angle = p5.random(p5.TWO_PI);
//         const dist = p5.random(3, 8);
//         p5.line(
//           this.x,
//           this.y,
//           this.x + p5.cos(angle) * dist,
//           this.y + p5.sin(angle) * dist
//         );
//       }
//     }
//   }

//   isDead(p5) {
//     return this.y > p5.height;
//   }
// }

// class DetailedCloud {
//   constructor(p5) {
//     this.x = p5.random(-300, p5.width + 300);
//     this.y = p5.random(80, 280);
//     this.mainSize = p5.random(120, 200);
//     this.speed = p5.random(0.3, 0.8);
//     this.opacity = 0;
//     this.targetOpacity = p5.random(140, 220);
//     this.puffs = [];

//     const puffCount = Math.floor(p5.random(5, 9));
//     for (let i = 0; i < puffCount; i++) {
//       this.puffs.push({
//         offsetX: (i - puffCount / 2) * this.mainSize * 0.35,
//         offsetY: p5.random(-20, 20),
//         size: this.mainSize * p5.random(0.6, 1.1),
//         drift: p5.random(p5.TWO_PI),
//       });
//     }
//   }

//   update(sentiment) {
//     this.x += this.speed;
//     if (this.x > window.innerWidth + 300) {
//       this.x = -300;
//     }

//     if (sentiment < -0.15) {
//       this.opacity = Math.min(this.opacity + 4, this.targetOpacity);
//     } else {
//       this.opacity = Math.max(this.opacity - 4, 0);
//     }

//     this.puffs.forEach((puff) => {
//       puff.drift += 0.01;
//     });
//   }

//   draw(p5, sentiment, timeOfDay) {
//     if (this.opacity <= 0) return;

//     p5.push();
//     p5.noStroke();

//     let cloudHue = 200;
//     let cloudSat = p5.map(sentiment, -1, 0, 15, 5);
//     let cloudBright = p5.map(sentiment, -1, 0, 22, 70) * timeOfDay;

//     this.puffs.forEach((puff, idx) => {
//       const driftX = p5.sin(puff.drift) * 5;
//       const driftY = p5.cos(puff.drift * 0.7) * 3;

//       p5.fill(cloudHue, cloudSat, cloudBright - 10, this.opacity * 0.6);
//       p5.ellipse(
//         this.x + puff.offsetX + driftX + 5,
//         this.y + puff.offsetY + driftY + 5,
//         puff.size,
//         puff.size * 0.75
//       );

//       p5.fill(cloudHue, cloudSat, cloudBright + (idx % 2) * 3, this.opacity);
//       p5.ellipse(
//         this.x + puff.offsetX + driftX,
//         this.y + puff.offsetY + driftY,
//         puff.size,
//         puff.size * 0.75
//       );

//       p5.fill(
//         cloudHue,
//         cloudSat - 5,
//         Math.min(100, cloudBright + 15),
//         this.opacity * 0.4
//       );
//       p5.ellipse(
//         this.x + puff.offsetX + driftX - puff.size * 0.15,
//         this.y + puff.offsetY + driftY - puff.size * 0.15,
//         puff.size * 0.5,
//         puff.size * 0.35
//       );
//     });

//     p5.pop();
//   }
// }

// class Lightning {
//   constructor(p5) {
//     this.startX = p5.random(p5.width * 0.2, p5.width * 0.8);
//     this.branches = [];
//     this.opacity = 255;
//     this.duration = 8;

//     this.generateBolt(
//       p5,
//       this.startX,
//       50,
//       p5.random(20, 50),
//       p5.height * 0.7,
//       0,
//       this.branches
//     );
//   }

//   generateBolt(p5, x, y, endX, endY, depth, array) {
//     if (depth > 4) return;

//     const segments = Math.floor(p5.random(5, 10));
//     let currentX = x;
//     let currentY = y;

//     for (let i = 0; i < segments; i++) {
//       const nextX = p5.lerp(x, endX, (i + 1) / segments) + p5.random(-25, 25);
//       const nextY = p5.lerp(y, endY, (i + 1) / segments) + p5.random(-15, 15);

//       array.push({
//         x1: currentX,
//         y1: currentY,
//         x2: nextX,
//         y2: nextY,
//         thickness: 4 - depth,
//       });

//       if (p5.random() < 0.3 && depth < 3) {
//         const branchEndX = nextX + p5.random(-80, 80);
//         const branchEndY = nextY + p5.random(50, 150);
//         this.generateBolt(
//           p5,
//           nextX,
//           nextY,
//           branchEndX,
//           branchEndY,
//           depth + 1,
//           array
//         );
//       }

//       currentX = nextX;
//       currentY = nextY;
//     }
//   }

//   update() {
//     this.duration--;
//     this.opacity = this.duration * 30;
//   }

//   draw(p5) {
//     p5.push();

//     for (let glow = 3; glow > 0; glow--) {
//       this.branches.forEach((segment) => {
//         p5.stroke(55, 15, 95, (this.opacity * 0.2) / glow);
//         p5.strokeWeight(segment.thickness + glow * 4);
//         p5.line(segment.x1, segment.y1, segment.x2, segment.y2);
//       });
//     }

//     this.branches.forEach((segment) => {
//       p5.stroke(55, 5, 100, this.opacity);
//       p5.strokeWeight(segment.thickness);
//       p5.line(segment.x1, segment.y1, segment.x2, segment.y2);
//     });

//     p5.fill(200, 10, 90, this.opacity * 0.15);
//     p5.noStroke();
//     p5.rect(0, 0, p5.width, p5.height);

//     p5.pop();
//   }

//   isDead() {
//     return this.duration <= 0;
//   }
// }

// class Bird {
//   constructor(p5) {
//     this.x = p5.random() < 0.5 ? -50 : p5.width + 50;
//     this.y = p5.random(100, 300);
//     this.speedX = this.x < 0 ? p5.random(2, 4) : p5.random(-4, -2);
//     this.speedY = p5.random(-0.5, 0.5);
//     this.wingPhase = p5.random(p5.TWO_PI);
//     this.size = p5.random(8, 15);
//   }

//   update() {
//     this.x += this.speedX;
//     this.y += this.speedY;
//     this.wingPhase += 0.15;
//   }

//   draw(p5, sentiment) {
//     if (sentiment < -0.5) return;

//     p5.push();
//     p5.translate(this.x, this.y);
//     if (this.speedX < 0) p5.scale(-1, 1);

//     const wingAngle = (p5.sin(this.wingPhase) * p5.PI) / 6;

//     p5.fill(0, 0, 15, 180);
//     p5.noStroke();

//     p5.ellipse(0, 0, this.size, this.size * 0.6);

//     p5.push();
//     p5.rotate(wingAngle);
//     p5.ellipse(this.size * 0.3, 0, this.size * 0.7, this.size * 0.3);
//     p5.pop();

//     p5.push();
//     p5.rotate(-wingAngle);
//     p5.ellipse(-this.size * 0.3, 0, this.size * 0.7, this.size * 0.3);
//     p5.pop();

//     p5.pop();
//   }

//   isDead(p5) {
//     return this.x < -100 || this.x > p5.width + 100;
//   }
// }

// function AuraVisualization({ sentiment, emotion, keywords }) {
//   const setup = (p5, canvasParentRef) => {
//     p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
//     p5.colorMode(p5.HSL, 360, 100, 100, 255);

//     p5.easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

//     generateCity(p5);
//   };

//   const generateCity = (p5) => {
//     buildings = [];

//     for (let depth = 0; depth < 1; depth += 0.2) {
//       let x = 30;
//       const depthFactor = 1 - depth;

//       while (x < p5.width - 30) {
//         const width = p5.random(80, 180) * depthFactor;
//         const height = p5.random(200, p5.height * 0.55) * depthFactor;
//         const type = p5.random(["modern", "classic", "skyscraper"]);

//         buildings.push(new DetailedBuilding(p5, x, width, height, depth, type));
//         x += width + p5.random(15, 40) * depthFactor;
//       }
//     }

//     buildings.sort((a, b) => a.depth - b.depth);

//     trees = [];
//     for (let i = 0; i < 20; i++) {
//       const x = p5.random(50, p5.width - 50);
//       const depth = p5.random(0.6, 1);
//       trees.push(new DetailedTree(p5, x, depth));
//     }
//     trees.sort((a, b) => a.depth - b.depth);

//     clouds = [];
//     for (let i = 0; i < 12; i++) {
//       clouds.push(new DetailedCloud(p5));
//     }

//     birds = [];
//     leaves = [];
//     raindrops = [];
//     lightningFlashes = [];
//   };

//   const draw = (p5) => {
//     time += 0.01;

//     if (isLoading) {
//       drawDetailedLoadingScreen(p5);
//       loadingProgress += 0.012;
//       if (loadingProgress >= 1) {
//         isLoading = false;
//       }
//       return;
//     }

//     currentSentiment = p5.lerp(currentSentiment, sentiment, 0.035);

//     const timeOfDay = p5.map(currentSentiment, -1, 1, 0.35, 1);

//     drawDetailedSky(p5, currentSentiment, timeOfDay);
//     drawSun(p5, currentSentiment, timeOfDay);

//     clouds.forEach((cloud) => {
//       cloud.update(currentSentiment);
//       cloud.draw(p5, currentSentiment, timeOfDay);
//     });

//     if (
//       currentSentiment < -0.65 &&
//       p5.frameCount % 80 === 0 &&
//       p5.random() < 0.4
//     ) {
//       lightningFlashes.push(new Lightning(p5));
//     }

//     lightningFlashes = lightningFlashes.filter((flash) => {
//       flash.update();
//       flash.draw(p5);
//       return !flash.isDead();
//     });

//     if (currentSentiment < -0.2) {
//       const rainIntensity = p5.map(currentSentiment, -1, -0.2, 8, 25);
//       if (p5.frameCount % Math.floor(rainIntensity) === 0) {
//         raindrops.push(new Raindrop(p5));
//       }
//     }

//     raindrops = raindrops.filter((drop) => {
//       drop.update();
//       drop.draw(p5);
//       return !drop.isDead(p5);
//     });

//     if (
//       currentSentiment > 0 &&
//       p5.frameCount % 120 === 0 &&
//       p5.random() < 0.4
//     ) {
//       birds.push(new Bird(p5));
//     }

//     birds = birds.filter((bird) => {
//       bird.update();
//       bird.draw(p5, currentSentiment);
//       return !bird.isDead(p5);
//     });

//     drawDetailedGround(p5, currentSentiment, timeOfDay);

//     const allObjects = [...buildings, ...trees].sort(
//       (a, b) => a.depth - b.depth
//     );

//     allObjects.forEach((obj) => {
//       if (obj instanceof DetailedBuilding) {
//         obj.draw(p5, currentSentiment, timeOfDay);
//       } else if (obj instanceof DetailedTree) {
//         obj.draw(p5, currentSentiment, timeOfDay);
//       }
//     });

//     const targetLeafCount = Math.floor(
//       p5.map(currentSentiment, -1, 1, 10, trees.length * 8)
//     );
//     const currentLeafCount = leaves.filter((l) => !l.falling).length;

//     if (
//       currentLeafCount < targetLeafCount &&
//       p5.frameCount % 4 === 0 &&
//       trees.length > 0
//     ) {
//       const randomTree = trees[Math.floor(p5.random(trees.length))];
//       const positions = randomTree.getLeafPositions(p5);
//       if (positions.length > 0) {
//         const pos = positions[Math.floor(p5.random(positions.length))];
//         leaves.push(new Leaf(p5, pos.x, pos.y, pos.x, pos.y));
//       }
//     }

//     if (currentLeafCount > targetLeafCount && p5.frameCount % 6 === 0) {
//       const attachedLeaves = leaves.filter((l) => !l.falling && !l.isDead(p5));
//       if (attachedLeaves.length > 0) {
//         const randomLeaf =
//           attachedLeaves[Math.floor(p5.random(attachedLeaves.length))];
//         randomLeaf.falling = true;
//       }
//     }

//     const windStrength = Math.abs(currentSentiment);
//     leaves = leaves.filter((leaf) => {
//       leaf.update(p5, windStrength);
//       leaf.draw(p5, currentSentiment);
//       return !leaf.isDead(p5);
//     });

//     drawProfessionalHUD(p5, currentSentiment, emotion, timeOfDay);
//   };

//   const drawDetailedSky = (p5, sentiment, timeOfDay) => {
//     let skyTopHue, skyTopSat, skyTopBright;
//     let skyBotHue, skyBotSat, skyBotBright;

//     if (sentiment < -0.4) {
//       skyTopHue = 220;
//       skyTopSat = p5.map(sentiment, -1, -0.4, 35, 25);
//       skyTopBright = p5.map(sentiment, -1, -0.4, 18, 28);
//       skyBotHue = 220;
//       skyBotSat = p5.map(sentiment, -1, -0.4, 25, 18);
//       skyBotBright = p5.map(sentiment, -1, -0.4, 25, 35);
//     } else if (sentiment < 0.15) {
//       skyTopHue = 200;
//       skyTopSat = 20;
//       skyTopBright = 45;
//       skyBotHue = 50;
//       skyBotSat = 25;
//       skyBotBright = 55;
//     } else {
//       skyTopHue = p5.map(sentiment, 0.15, 1, 205, 200);
//       skyTopSat = p5.map(sentiment, 0.15, 1, 45, 65);
//       skyTopBright = p5.map(sentiment, 0.15, 1, 65, 78);
//       skyBotHue = p5.map(sentiment, 0.15, 1, 195, 50);
//       skyBotSat = p5.map(sentiment, 0.15, 1, 40, 55);
//       skyBotBright = p5.map(sentiment, 0.15, 1, 70, 85);
//     }

//     skyTopBright *= timeOfDay;
//     skyBotBright *= timeOfDay;

//     for (let y = 0; y < p5.height * 0.7; y++) {
//       const inter = y / (p5.height * 0.7);
//       const hue = p5.lerp(skyTopHue, skyBotHue, inter);
//       const sat = p5.lerp(skyTopSat, skyBotSat, inter);
//       const bright = p5.lerp(skyTopBright, skyBotBright, inter);

//       p5.stroke(hue, sat, bright);
//       p5.line(0, y, p5.width, y);
//     }
//   };

//   const drawSun = (p5, sentiment, timeOfDay) => {
//     targetSunY = p5.map(sentiment, -1, 1, -120, p5.height * 0.22);
//     sunY = p5.lerp(sunY, targetSunY, 0.04);

//     if (sunY > -50 && sunY < p5.height * 0.6) {
//       p5.push();

//       const sunX = p5.width * 0.78;
//       const sunSize = p5.map(sentiment, -0.3, 1, 70, 110);
//       const sunHue = p5.map(sentiment, -0.3, 1, 48, 52);
//       const sunSat = p5.map(sentiment, -0.3, 1, 75, 85);
//       const sunBright = p5.map(sentiment, -0.3, 1, 75, 98);

//       for (let i = 5; i > 0; i--) {
//         const glowSize = sunSize * (1 + i * 0.25);
//         const glowOpacity = 25 / (i * 1.5);
//         p5.fill(sunHue, sunSat - 10, sunBright, glowOpacity);
//         p5.noStroke();
//         p5.ellipse(sunX, sunY, glowSize);
//       }

//       p5.fill(sunHue, sunSat, sunBright);
//       p5.ellipse(sunX, sunY, sunSize);

//       p5.fill(sunHue, sunSat - 30, 100, 180);
//       p5.ellipse(sunX - sunSize * 0.15, sunY - sunSize * 0.15, sunSize * 0.4);

//       if (sentiment > 0.65) {
//         p5.stroke(sunHue, sunSat - 20, sunBright - 5, 40);
//         p5.strokeWeight(3);
//         for (let i = 0; i < 12; i++) {
//           const angle = (i / 12) * p5.TWO_PI + time;
//           const rayLength =
//             sunSize * p5.map(p5.sin(time * 2 + i), -1, 1, 1.8, 2.5);
//           const x2 = sunX + p5.cos(angle) * rayLength;
//           const y2 = sunY + p5.sin(angle) * rayLength;
//           p5.line(sunX, sunY, x2, y2);
//         }
//       }

//       p5.pop();
//     }
//   };

//   const drawDetailedGround = (p5, sentiment, timeOfDay) => {
//     let groundHue = 85;
//     let groundSat = 45;
//     let groundBright = p5.map(sentiment, -1, 1, 20, 32) * timeOfDay;

//     for (let y = p5.height * 0.7; y < p5.height; y++) {
//       const inter = (y - p5.height * 0.7) / (p5.height * 0.3);
//       const bright = p5.lerp(groundBright, groundBright - 8, inter);
//       p5.stroke(groundHue, groundSat, bright);
//       p5.line(0, y, p5.width, y);
//     }

//     p5.fill(0, 0, groundBright + 8);
//     p5.noStroke();
//     p5.rect(0, p5.height * 0.7, p5.width, 8);

//     for (let x = 0; x < p5.width; x += 60) {
//       p5.stroke(0, 0, groundBright + 3);
//       p5.strokeWeight(2);
//       p5.line(x, p5.height * 0.7, x, p5.height * 0.7 + 8);
//     }
//   };

//   const drawDetailedLoadingScreen = (p5) => {
//     p5.background(15, 25, 22);

//     p5.push();

//     const progress = p5.easeOutCubic(loadingProgress);

//     for (let i = 0; i < 15; i++) {
//       const x = p5.map(i, 0, 14, p5.width * 0.1, p5.width * 0.9);
//       const maxHeight = p5.height * (0.25 + (i % 5) * 0.08);
//       const height = maxHeight * progress;
//       const width = p5.random(40, 80);

//       p5.fill(0, 0, 15);
//       p5.noStroke();
//       p5.rect(x, p5.height - height, width, height);

//       if (progress > 0.4) {
//         const windowProgress = p5.map(progress, 0.4, 1, 0, 1);
//         const rows = Math.floor((height / 20) * windowProgress);
//         for (let r = 0; r < rows; r++) {
//           if (p5.random() > 0.3) {
//             p5.fill(50, 40, 70, 200);
//             p5.rect(x + width * 0.3, p5.height - height + r * 20 + 5, 8, 10);
//           }
//         }
//       }
//     }

//     p5.textAlign(p5.CENTER, p5.CENTER);
//     p5.fill(255, 255, 255, 220);
//     p5.textSize(38);
//     p5.textStyle(p5.BOLD);
//     p5.text("CONSTRUCTING METROPOLIS", p5.width / 2, p5.height / 2 - 70);

//     const barWidth = 400;
//     const barHeight = 6;
//     const barX = p5.width / 2 - barWidth / 2;
//     const barY = p5.height / 2;

//     p5.fill(255, 255, 255, 30);
//     p5.noStroke();
//     p5.rect(barX, barY, barWidth, barHeight, 3);

//     const fillWidth = barWidth * progress;
//     for (let i = 0; i < fillWidth; i++) {
//       const bright = p5.map(i, 0, fillWidth, 60, 85);
//       p5.stroke(200, 45, bright, 220);
//       p5.line(barX + i, barY, barX + i, barY + barHeight);
//     }

//     p5.noStroke();
//     p5.fill(255, 255, 255, 200);
//     p5.textSize(18);
//     p5.textStyle(p5.NORMAL);
//     p5.text(`${Math.floor(progress * 100)}%`, p5.width / 2, barY + 35);

//     let statusText = "Initializing...";
//     if (progress > 0.25) statusText = "Generating buildings...";
//     if (progress > 0.5) statusText = "Planting trees...";
//     if (progress > 0.75) statusText = "Setting atmosphere...";
//     if (progress > 0.95) statusText = "Ready!";

//     p5.textSize(14);
//     p5.fill(255, 255, 255, 160);
//     p5.text(statusText, p5.width / 2, barY + 60);

//     p5.pop();
//   };

//   const drawProfessionalHUD = (p5, sentiment, emotion, timeOfDay) => {
//     p5.push();

//     p5.fill(0, 0, 0, 175);
//     p5.noStroke();
//     p5.rect(0, p5.height - 70, p5.width, 70);

//     p5.stroke(255, 255, 255, 60);
//     p5.strokeWeight(1);
//     p5.line(0, p5.height - 70, p5.width, p5.height - 70);

//     p5.textAlign(p5.LEFT, p5.CENTER);
//     p5.noStroke();

//     let emoji = "😐";
//     let weatherIcon = "☁️";
//     let weatherText = "Overcast";

//     if (sentiment < -0.65) {
//       emoji = "😢";
//       weatherIcon = "⛈️";
//       weatherText = "Stormy";
//     } else if (sentiment < -0.25) {
//       emoji = "😕";
//       weatherIcon = "🌧️";
//       weatherText = "Rainy";
//     } else if (sentiment > 0.6) {
//       emoji = "😄";
//       weatherIcon = "☀️";
//       weatherText = "Clear";
//     } else if (sentiment > 0.25) {
//       emoji = "🙂";
//       weatherIcon = "⛅";
//       weatherText = "Partly Cloudy";
//     }

//     p5.fill(255, 255, 255, 240);
//     p5.textSize(22);
//     p5.text(`${emoji} ${emotion.toUpperCase()}`, 30, p5.height - 35);

//     p5.textAlign(p5.CENTER);
//     p5.textSize(18);
//     p5.fill(255, 255, 255, 220);
//     p5.text(`${weatherIcon} ${weatherText}`, p5.width / 2, p5.height - 42);

//     p5.textSize(14);
//     p5.fill(255, 255, 255, 180);
//     p5.text(`Sentiment: ${sentiment.toFixed(3)}`, p5.width / 2, p5.height - 20);

//     p5.textAlign(p5.RIGHT);
//     p5.textSize(14);
//     p5.fill(255, 255, 255, 200);
//     const timeText =
//       timeOfDay > 0.7 ? "☀️ Day" : timeOfDay > 0.5 ? "🌤️ Evening" : "🌙 Night";
//     p5.text(timeText, p5.width - 30, p5.height - 35);

//     p5.pop();
//   };

//   const windowResized = (p5) => {
//     p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
//     generateCity(p5);
//   };

//   return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
// }

// // export default AuraVisualization;
// 11111111111111111111111111111111111111111111111

// import React from "react";
// import Sketch from "react-p5";
// let buildings = [];
// // let trees = [];
// let leaves = [];
// let raindrops = [];
// let lightningFlashes = [];
// let clouds = [];
// let birds = [];
// let waves = [];
// let boats = [];
// let fish = [];
// let bubbles = [];
// let seagulls = [];
// let time = 0;
// let currentSentiment = 0;
// let sunY = 0;
// let targetSunY = 0;
// let loadingProgress = 0;
// let isLoading = true;

// class DetailedBuilding {
//   constructor(p5, x, width, height, depth, type) {
//     this.x = x;
//     this.width = width;
//     this.height = height;
//     this.depth = depth;
//     this.baseY = p5.height * 0.55; // Raised for ocean view
//     this.type = type;

//     this.actualWidth = width * (0.6 + depth * 0.4);
//     this.actualHeight = height * (0.7 + depth * 0.3);

//     this.windowWidth = 8;
//     this.windowHeight = 12;
//     this.windowSpacingX = 14;
//     this.windowSpacingY = 20;
//     this.cols = Math.floor(this.actualWidth / this.windowSpacingX);
//     this.rows = Math.floor(this.actualHeight / this.windowSpacingY);

//     this.windowPattern = [];
//     for (let i = 0; i < this.rows * this.cols; i++) {
//       this.windowPattern.push({
//         lit: p5.random() > 0.4,
//         flicker: p5.random(0.8, 1.2),
//         flickerSpeed: p5.random(0.5, 2),
//       });
//     }

//     this.hasSpire = this.type === "skyscraper" && p5.random() > 0.5;
//     this.hasAntenna = this.type === "skyscraper" && p5.random() > 0.6;
//     this.roofStyle = Math.floor(p5.random(3));
//     this.accentColor = p5.random(["blue", "red", "green", "white"]);

//     this.sections = [];
//     let currentHeight = 0;
//     while (currentHeight < this.actualHeight) {
//       const sectionHeight = p5.random(
//         this.actualHeight * 0.2,
//         this.actualHeight * 0.4
//       );
//       const sectionWidth = this.actualWidth * p5.random(0.85, 1);
//       this.sections.push({
//         height: Math.min(sectionHeight, this.actualHeight - currentHeight),
//         width: sectionWidth,
//         offset: (this.actualWidth - sectionWidth) / 2,
//       });
//       currentHeight += sectionHeight;
//     }
//   }

//   draw(p5, sentiment, timeOfDay) {
//     p5.push();

//     let buildingHue = 220;
//     let buildingSat = p5.map(sentiment, -1, 1, 8, 18);
//     let buildingBright = p5.map(sentiment, -1, 1, 18, 38);

//     buildingBright *= timeOfDay;
//     buildingSat *= 1 - this.depth * 0.3;
//     buildingBright = p5.lerp(buildingBright, 60, this.depth * 0.4);

//     let yPos = this.baseY - this.actualHeight;

//     this.sections.forEach((section, idx) => {
//       const sectionBright = buildingBright + (idx % 2) * 2;
//       p5.fill(buildingHue, buildingSat, sectionBright);
//       p5.stroke(buildingHue, buildingSat, sectionBright - 10);
//       p5.strokeWeight(1 + this.depth);

//       const sectionX = this.x + section.offset;
//       p5.rect(sectionX, yPos, section.width, section.height);

//       if (this.depth > 0.5) {
//         p5.fill(buildingHue, buildingSat, sectionBright - 8);
//         p5.beginShape();
//         p5.vertex(sectionX + section.width, yPos);
//         p5.vertex(sectionX + section.width + 8, yPos + 5);
//         p5.vertex(sectionX + section.width + 8, yPos + section.height + 5);
//         p5.vertex(sectionX + section.width, yPos + section.height);
//         p5.endShape(p5.CLOSE);
//       }

//       yPos += section.height;
//     });

//     this.drawWindows(p5, sentiment, timeOfDay, buildingHue);
//     this.drawRoof(p5, sentiment, timeOfDay, buildingBright);

//     if (this.depth > 0.6) {
//       this.drawAccents(p5, sentiment);
//     }

//     // Draw reflection in water
//     this.drawReflection(
//       p5,
//       sentiment,
//       timeOfDay,
//       buildingHue,
//       buildingSat,
//       buildingBright
//     );

//     p5.pop();
//   }

//   drawWindows(p5, sentiment, timeOfDay, buildingHue) {
//     const glowIntensity = p5.map(timeOfDay, 0.3, 1, 1, 0.3);

//     for (let row = 0; row < this.rows; row++) {
//       for (let col = 0; col < this.cols; col++) {
//         const idx = row * this.cols + col;
//         if (idx >= this.windowPattern.length) continue;

//         const window = this.windowPattern[idx];
//         if (!window.lit) continue;

//         const wx = this.x + col * this.windowSpacingX + 3;
//         const wy =
//           this.baseY - this.actualHeight + row * this.windowSpacingY + 4;

//         const flicker =
//           p5.noise(idx * 0.1, time * window.flickerSpeed) * 0.2 + 0.8;

//         let windowHue = 50;
//         let windowSat = 30;
//         let windowBright =
//           p5.map(sentiment, -1, 1, 50, 85) * glowIntensity * flicker;

//         if (this.depth > 0.7 && windowBright > 60) {
//           p5.fill(windowHue, windowSat - 10, windowBright + 10, 100);
//           p5.noStroke();
//           p5.rect(wx - 2, wy - 2, this.windowWidth + 4, this.windowHeight + 4);
//         }

//         p5.fill(windowHue, windowSat, windowBright);
//         p5.noStroke();
//         p5.rect(wx, wy, this.windowWidth, this.windowHeight);

//         p5.fill(
//           windowHue,
//           windowSat - 20,
//           Math.min(100, windowBright + 15),
//           150
//         );
//         p5.rect(wx, wy, this.windowWidth, this.windowHeight * 0.4);

//         p5.stroke(buildingHue, 10, 25);
//         p5.strokeWeight(0.5);
//         p5.noFill();
//         p5.rect(wx, wy, this.windowWidth, this.windowHeight);
//       }
//     }
//   }

//   drawRoof(p5, sentiment, timeOfDay, buildingBright) {
//     const roofY = this.baseY - this.actualHeight;

//     p5.stroke(220, 10, buildingBright - 10);
//     p5.strokeWeight(1);

//     if (this.roofStyle === 0) {
//       p5.fill(220, 15, buildingBright + 5);
//       p5.rect(this.x, roofY - 8, this.actualWidth, 8);

//       if (this.depth > 0.6) {
//         p5.fill(220, 10, buildingBright - 5);
//         p5.rect(this.x + 10, roofY - 15, 15, 7);
//         p5.rect(this.x + this.actualWidth - 25, roofY - 15, 15, 7);
//       }
//     } else if (this.roofStyle === 1) {
//       p5.fill(220, 15, buildingBright + 3);
//       p5.triangle(
//         this.x,
//         roofY,
//         this.x + this.actualWidth / 2,
//         roofY - 20,
//         this.x + this.actualWidth,
//         roofY
//       );
//     }

//     if (this.hasSpire) {
//       p5.fill(220, 20, buildingBright + 10);
//       p5.triangle(
//         this.x + this.actualWidth / 2 - 5,
//         roofY,
//         this.x + this.actualWidth / 2,
//         roofY - 40,
//         this.x + this.actualWidth / 2 + 5,
//         roofY
//       );

//       const spireLight = p5.map(sentiment, -1, 1, 50, 90);
//       p5.fill(this.accentColor === "red" ? 0 : 220, 80, spireLight);
//       p5.noStroke();
//       p5.ellipse(this.x + this.actualWidth / 2, roofY - 40, 6, 6);
//     }

//     if (this.hasAntenna) {
//       p5.stroke(0, 0, buildingBright + 15);
//       p5.strokeWeight(2);
//       p5.line(
//         this.x + this.actualWidth / 2,
//         roofY - 5,
//         this.x + this.actualWidth / 2,
//         roofY - 60
//       );

//       p5.fill(0, 90, 60);
//       p5.noStroke();
//       if (p5.frameCount % 60 < 30) {
//         p5.ellipse(this.x + this.actualWidth / 2, roofY - 60, 4, 4);
//       }
//     }
//   }

//   drawAccents(p5, sentiment) {
//     const entranceY = this.baseY - 30;
//     p5.fill(220, 25, 15);
//     p5.rect(
//       this.x + this.actualWidth * 0.3,
//       entranceY,
//       this.actualWidth * 0.4,
//       30
//     );

//     p5.fill(50, 40, 70);
//     p5.noStroke();
//     p5.ellipse(this.x + this.actualWidth / 2, entranceY + 15, 8, 8);
//   }

//   drawReflection(
//     p5,
//     sentiment,
//     timeOfDay,
//     buildingHue,
//     buildingSat,
//     buildingBright
//   ) {
//     if (this.depth < 0.4) return; // Only near buildings have clear reflections

//     const waterY = p5.height * 0.55;
//     const reflectionHeight = this.actualHeight * 0.6;
//     const distortion = Math.abs(sentiment) * 8;

//     p5.push();
//     p5.translate(0, waterY);

//     // Distorted reflection
//     for (let y = 0; y < reflectionHeight; y += 3) {
//       const waveOffset = p5.sin(time * 2 + y * 0.05) * distortion;
//       const alpha = p5.map(y, 0, reflectionHeight, 100, 0);

//       p5.fill(buildingHue, buildingSat, buildingBright - 10, alpha);
//       p5.noStroke();
//       p5.rect(this.x + waveOffset, y, this.actualWidth, 3);
//     }

//     p5.pop();
//   }
// }

// class Wave {
//   constructor(p5, yPos, amplitude, frequency, speed, depth) {
//     this.yPos = yPos;
//     this.amplitude = amplitude;
//     this.frequency = frequency;
//     this.speed = speed;
//     this.depth = depth;
//     this.offset = p5.random(1000);
//   }

//   draw(p5, sentiment) {
//     // Wave intensity based on sentiment
//     const intensity = Math.abs(sentiment);
//     const currentAmplitude = this.amplitude * (1 + intensity * 1.5);
//     const currentSpeed = this.speed * (1 + intensity * 0.8);

//     p5.push();
//     p5.noFill();

//     // Wave color
//     let waveHue = p5.map(sentiment, -1, 1, 200, 190);
//     let waveSat = p5.map(sentiment, -1, 1, 60, 75);
//     let waveBright = p5.map(sentiment, -1, 1, 25, 45);

//     // Apply depth
//     waveBright += this.depth * 15;
//     const alpha = p5.map(this.depth, 0, 1, 80, 180);

//     p5.stroke(waveHue, waveSat, waveBright, alpha);
//     p5.strokeWeight(2 + this.depth * 2);

//     p5.beginShape();
//     for (let x = 0; x <= p5.width; x += 10) {
//       const y =
//         this.yPos +
//         p5.sin(x * this.frequency + time * currentSpeed + this.offset) *
//           currentAmplitude;
//       p5.vertex(x, y);
//     }
//     p5.endShape();

//     p5.pop();
//   }
// }

// class Boat {
//   constructor(p5) {
//     this.x = p5.random() < 0.5 ? -100 : p5.width + 100;
//     this.y = p5.random(p5.height * 0.58, p5.height * 0.68);
//     this.speed = this.x < 0 ? p5.random(0.5, 1.5) : p5.random(-1.5, -0.5);
//     this.size = p5.random(40, 70);
//     this.bobPhase = p5.random(p5.TWO_PI);
//     this.type = p5.random(["sail", "cargo", "yacht"]);
//     this.sailColor = p5.random([0, 50, 190, 280]);
//   }

//   update(p5, sentiment) {
//     this.x += this.speed;
//     this.bobPhase += 0.02;

//     // Bob up and down with waves
//     const waveIntensity = Math.abs(sentiment);
//     this.y += p5.sin(this.bobPhase) * 0.5 * (1 + waveIntensity);
//   }

//   draw(p5, sentiment) {
//     p5.push();
//     p5.translate(this.x, this.y);
//     if (this.speed < 0) p5.scale(-1, 1);

//     // Hull
//     p5.fill(220, 15, 35);
//     p5.stroke(220, 15, 25);
//     p5.strokeWeight(2);
//     p5.beginShape();
//     p5.vertex(0, 0);
//     p5.vertex(this.size, 0);
//     p5.vertex(this.size * 0.9, this.size * 0.3);
//     p5.vertex(this.size * 0.1, this.size * 0.3);
//     p5.endShape(p5.CLOSE);

//     // Cabin
//     if (this.type === "cargo" || this.type === "yacht") {
//       p5.fill(220, 20, 45);
//       p5.rect(
//         this.size * 0.3,
//         -this.size * 0.2,
//         this.size * 0.4,
//         this.size * 0.2
//       );
//     }

//     // Sail
//     if (this.type === "sail") {
//       p5.fill(this.sailColor, 70, 85, 200);
//       p5.noStroke();
//       p5.triangle(
//         this.size * 0.5,
//         -this.size * 0.1,
//         this.size * 0.5,
//         -this.size * 1.2,
//         this.size * 0.8,
//         -this.size * 0.1
//       );

//       // Mast
//       p5.stroke(30, 30, 30);
//       p5.strokeWeight(3);
//       p5.line(this.size * 0.5, 0, this.size * 0.5, -this.size * 1.3);
//     }

//     // Windows
//     if (this.type !== "sail") {
//       p5.fill(50, 60, 80);
//       p5.noStroke();
//       for (let i = 0; i < 3; i++) {
//         p5.rect(
//           this.size * (0.35 + i * 0.12),
//           -this.size * 0.15,
//           this.size * 0.08,
//           this.size * 0.08
//         );
//       }
//     }

//     // Reflection
//     p5.push();
//     p5.scale(1, -0.4);
//     p5.translate(0, -this.size * 0.6);
//     p5.fill(220, 15, 25, 60);
//     p5.noStroke();
//     p5.beginShape();
//     p5.vertex(0, 0);
//     p5.vertex(this.size, 0);
//     p5.vertex(this.size * 0.9, this.size * 0.3);
//     p5.vertex(this.size * 0.1, this.size * 0.3);
//     p5.endShape(p5.CLOSE);
//     p5.pop();

//     p5.pop();
//   }

//   isDead(p5) {
//     return this.x < -150 || this.x > p5.width + 150;
//   }
// }

// class Fish {
//   constructor(p5) {
//     this.x = p5.random(p5.width);
//     this.y = p5.random(p5.height * 0.6, p5.height * 0.85);
//     this.speedX = p5.random(-1, 1);
//     this.speedY = p5.random(-0.3, 0.3);
//     this.size = p5.random(8, 20);
//     this.tailPhase = p5.random(p5.TWO_PI);
//     this.depth = p5.random(0.3, 1);
//     this.hue = p5.random([30, 180, 280]);
//   }

//   update(p5, sentiment) {
//     // More active in positive sentiment
//     const activity = p5.map(sentiment, -1, 1, 0.3, 1.5);

//     this.x += this.speedX * activity;
//     this.y += this.speedY * activity;
//     this.tailPhase += 0.2;

//     // Boundary check
//     if (this.x < 0 || this.x > p5.width) this.speedX *= -1;
//     if (this.y < p5.height * 0.58 || this.y > p5.height * 0.9)
//       this.speedY *= -1;

//     // Random direction change
//     if (p5.random() < 0.02) {
//       this.speedX += p5.random(-0.2, 0.2);
//       this.speedY += p5.random(-0.1, 0.1);
//     }
//   }

//   draw(p5) {
//     p5.push();
//     p5.translate(this.x, this.y);
//     if (this.speedX < 0) p5.scale(-1, 1);

//     const alpha = this.depth * 180;

//     // Body
//     p5.fill(this.hue, 70, 60, alpha);
//     p5.noStroke();
//     p5.ellipse(0, 0, this.size, this.size * 0.5);

//     // Tail
//     const tailSwing = p5.sin(this.tailPhase) * 0.3;
//     p5.push();
//     p5.rotate(tailSwing);
//     p5.triangle(
//       -this.size * 0.5,
//       0,
//       -this.size * 0.9,
//       -this.size * 0.3,
//       -this.size * 0.9,
//       this.size * 0.3
//     );
//     p5.pop();

//     // Eye
//     p5.fill(0, 0, 0, alpha);
//     p5.ellipse(this.size * 0.3, -this.size * 0.1, this.size * 0.15);

//     p5.pop();
//   }
// }

// class Bubble {
//   constructor(p5) {
//     this.x = p5.random(p5.width);
//     this.y = p5.height * 0.9;
//     this.size = p5.random(3, 12);
//     this.speed = p5.random(0.5, 2);
//     this.wobble = p5.random(p5.TWO_PI);
//     this.wobbleSpeed = p5.random(0.02, 0.05);
//   }

//   update() {
//     this.y -= this.speed;
//     this.wobble += this.wobbleSpeed;
//     this.x += Math.sin(this.wobble) * 0.5;
//   }

//   draw(p5) {
//     p5.push();
//     p5.noFill();
//     p5.stroke(190, 40, 80, 120);
//     p5.strokeWeight(1.5);
//     p5.ellipse(this.x, this.y, this.size);

//     // Highlight
//     p5.fill(190, 20, 95, 100);
//     p5.noStroke();
//     p5.ellipse(
//       this.x - this.size * 0.2,
//       this.y - this.size * 0.2,
//       this.size * 0.3
//     );
//     p5.pop();
//   }

//   isDead(p5) {
//     return this.y < p5.height * 0.55;
//   }
// }

// class Seagull {
//   constructor(p5) {
//     this.x = p5.random() < 0.5 ? -50 : p5.width + 50;
//     this.y = p5.random(p5.height * 0.2, p5.height * 0.45);
//     this.speedX = this.x < 0 ? p5.random(2, 4) : p5.random(-4, -2);
//     this.speedY = p5.random(-0.5, 0.5);
//     this.wingPhase = p5.random(p5.TWO_PI);
//     this.size = p5.random(12, 20);
//     this.glidePhase = p5.random(100);
//   }

//   update() {
//     this.x += this.speedX;
//     this.y += this.speedY + Math.sin(this.glidePhase * 0.05) * 0.3;
//     this.wingPhase += 0.12;
//     this.glidePhase++;
//   }

//   draw(p5, sentiment) {
//     if (sentiment < -0.6) return; // Hide in storms

//     p5.push();
//     p5.translate(this.x, this.y);
//     if (this.speedX < 0) p5.scale(-1, 1);

//     const wingAngle = (p5.sin(this.wingPhase) * p5.PI) / 5;

//     // Body
//     p5.fill(0, 0, 95, 200);
//     p5.noStroke();
//     p5.ellipse(0, 0, this.size * 0.8, this.size * 0.5);

//     // Wings
//     p5.push();
//     p5.rotate(wingAngle);
//     p5.fill(0, 0, 95, 180);
//     p5.beginShape();
//     p5.vertex(0, 0);
//     p5.bezierVertex(
//       this.size * 0.4,
//       -this.size * 0.2,
//       this.size * 0.8,
//       -this.size * 0.3,
//       this.size,
//       -this.size * 0.2
//     );
//     p5.vertex(this.size * 0.3, 0);
//     p5.endShape(p5.CLOSE);
//     p5.pop();

//     p5.push();
//     p5.rotate(-wingAngle);
//     p5.fill(0, 0, 95, 180);
//     p5.beginShape();
//     p5.vertex(0, 0);
//     p5.bezierVertex(
//       -this.size * 0.4,
//       -this.size * 0.2,
//       -this.size * 0.8,
//       -this.size * 0.3,
//       -this.size,
//       -this.size * 0.2
//     );
//     p5.vertex(-this.size * 0.3, 0);
//     p5.endShape(p5.CLOSE);
//     p5.pop();

//     // Head
//     p5.fill(0, 0, 98);
//     p5.ellipse(this.size * 0.4, -this.size * 0.1, this.size * 0.4);

//     // Beak
//     p5.fill(40, 70, 70);
//     p5.triangle(
//       this.size * 0.5,
//       -this.size * 0.05,
//       this.size * 0.7,
//       0,
//       this.size * 0.5,
//       0.05 * this.size
//     );

//     p5.pop();
//   }

//   isDead(p5) {
//     return this.x < -100 || this.x > p5.width + 100;
//   }
// }

// class Raindrop {
//   constructor(p5) {
//     this.x = p5.random(p5.width);
//     this.y = p5.random(-200, -50);
//     this.speed = p5.random(15, 25);
//     this.length = p5.random(15, 35);
//     this.opacity = p5.random(120, 220);
//     this.thickness = p5.random(1.5, 3);
//   }

//   update() {
//     this.y += this.speed;
//     this.speed += 0.2;
//   }

//   draw(p5) {
//     p5.stroke(200, 15, 75, this.opacity);
//     p5.strokeWeight(this.thickness);
//     p5.line(this.x, this.y, this.x - 2, this.y + this.length);

//     if (this.y > p5.height * 0.55 - 5 && this.y < p5.height * 0.55 + 5) {
//       p5.stroke(200, 15, 75, this.opacity * 0.5);
//       p5.strokeWeight(1);
//       for (let i = 0; i < 3; i++) {
//         const angle = p5.random(p5.TWO_PI);
//         const dist = p5.random(3, 8);
//         p5.line(
//           this.x,
//           this.y,
//           this.x + p5.cos(angle) * dist,
//           this.y + p5.sin(angle) * dist
//         );
//       }
//     }
//   }

//   isDead(p5) {
//     return this.y > p5.height;
//   }
// }

// class DetailedCloud {
//   constructor(p5) {
//     this.x = p5.random(-300, p5.width + 300);
//     this.y = p5.random(80, 280);
//     this.mainSize = p5.random(120, 200);
//     this.speed = p5.random(0.3, 0.8);
//     this.opacity = 0;
//     this.targetOpacity = p5.random(140, 220);
//     this.puffs = [];

//     const puffCount = Math.floor(p5.random(5, 9));
//     for (let i = 0; i < puffCount; i++) {
//       this.puffs.push({
//         offsetX: (i - puffCount / 2) * this.mainSize * 0.35,
//         offsetY: p5.random(-20, 20),
//         size: this.mainSize * p5.random(0.6, 1.1),
//         drift: p5.random(p5.TWO_PI),
//       });
//     }
//   }

//   update(sentiment) {
//     this.x += this.speed;
//     if (this.x > window.innerWidth + 300) {
//       this.x = -300;
//     }

//     if (sentiment < -0.15) {
//       this.opacity = Math.min(this.opacity + 4, this.targetOpacity);
//     } else {
//       this.opacity = Math.max(this.opacity - 4, 0);
//     }

//     this.puffs.forEach((puff) => {
//       puff.drift += 0.01;
//     });
//   }

//   draw(p5, sentiment, timeOfDay) {
//     if (this.opacity <= 0) return;

//     p5.push();
//     p5.noStroke();

//     let cloudHue = 200;
//     let cloudSat = p5.map(sentiment, -1, 0, 15, 5);
//     let cloudBright = p5.map(sentiment, -1, 0, 22, 70) * timeOfDay;

//     this.puffs.forEach((puff, idx) => {
//       const driftX = p5.sin(puff.drift) * 5;
//       const driftY = p5.cos(puff.drift * 0.7) * 3;

//       p5.fill(cloudHue, cloudSat, cloudBright - 10, this.opacity * 0.6);
//       p5.ellipse(
//         this.x + puff.offsetX + driftX + 5,
//         this.y + puff.offsetY + driftY + 5,
//         puff.size,
//         puff.size * 0.75
//       );

//       p5.fill(cloudHue, cloudSat, cloudBright + (idx % 2) * 3, this.opacity);
//       p5.ellipse(
//         this.x + puff.offsetX + driftX,
//         this.y + puff.offsetY + driftY,
//         puff.size,
//         puff.size * 0.75
//       );

//       p5.fill(
//         cloudHue,
//         cloudSat - 5,
//         Math.min(100, cloudBright + 15),
//         this.opacity * 0.4
//       );
//       p5.ellipse(
//         this.x + puff.offsetX + driftX - puff.size * 0.15,
//         this.y + puff.offsetY + driftY - puff.size * 0.15,
//         puff.size * 0.5,
//         puff.size * 0.35
//       );
//     });

//     p5.pop();
//   }
// }

// class Lightning {
//   constructor(p5) {
//     this.startX = p5.random(p5.width * 0.2, p5.width * 0.8);
//     this.branches = [];
//     this.opacity = 255;
//     this.duration = 8;

//     this.generateBolt(
//       p5,
//       this.startX,
//       50,
//       p5.random(20, 50),
//       p5.height * 0.55,
//       0,
//       this.branches
//     );
//   }

//   generateBolt(p5, x, y, endX, endY, depth, array) {
//     if (depth > 4) return;

//     const segments = Math.floor(p5.random(5, 10));
//     let currentX = x;
//     let currentY = y;

//     for (let i = 0; i < segments; i++) {
//       const nextX = p5.lerp(x, endX, (i + 1) / segments) + p5.random(-25, 25);
//       const nextY = p5.lerp(y, endY, (i + 1) / segments) + p5.random(-15, 15);

//       array.push({
//         x1: currentX,
//         y1: currentY,
//         x2: nextX,
//         y2: nextY,
//         thickness: 4 - depth,
//       });

//       if (p5.random() < 0.3 && depth < 3) {
//         const branchEndX = nextX + p5.random(-80, 80);
//         const branchEndY = nextY + p5.random(50, 150);
//         this.generateBolt(
//           p5,
//           nextX,
//           nextY,
//           branchEndX,
//           branchEndY,
//           depth + 1,
//           array
//         );
//       }

//       currentX = nextX;
//       currentY = nextY;
//     }
//   }

//   update() {
//     this.duration--;
//     this.opacity = this.duration * 30;
//   }

//   draw(p5) {
//     p5.push();

//     for (let glow = 3; glow > 0; glow--) {
//       this.branches.forEach((segment) => {
//         p5.stroke(55, 15, 95, (this.opacity * 0.2) / glow);
//         p5.strokeWeight(segment.thickness + glow * 4);
//         p5.line(segment.x1, segment.y1, segment.x2, segment.y2);
//       });
//     }

//     this.branches.forEach((segment) => {
//       p5.stroke(55, 5, 100, this.opacity);
//       p5.strokeWeight(segment.thickness);
//       p5.line(segment.x1, segment.y1, segment.x2, segment.y2);
//     });

//     p5.fill(200, 10, 90, this.opacity * 0.15);
//     p5.noStroke();
//     p5.rect(0, 0, p5.width, p5.height);

//     p5.pop();
//   }

//   isDead() {
//     return this.duration <= 0;
//   }
// }
// // Copy all your other classes (DetailedTree, Leaf, Raindrop, DetailedCloud, Lightning, Bird)
// // from the previous version - they remain the same

// function AuraVisualization({ sentiment, emotion, keywords }) {
//   const setup = (p5, canvasParentRef) => {
//     p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
//     p5.colorMode(p5.HSL, 360, 100, 100, 255);

//     p5.easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

//     generateScene(p5);
//   };

//   const generateScene = (p5) => {
//     // Buildings
//     buildings = [];
//     for (let depth = 0; depth < 1; depth += 0.25) {
//       let x = 30;
//       const depthFactor = 1 - depth;

//       while (x < p5.width - 30) {
//         const width = p5.random(80, 180) * depthFactor;
//         const height = p5.random(150, p5.height * 0.4) * depthFactor;
//         const type = p5.random(["modern", "classic", "skyscraper"]);

//         buildings.push(new DetailedBuilding(p5, x, width, height, depth, type));
//         x += width + p5.random(15, 40) * depthFactor;
//       }
//     }
//     buildings.sort((a, b) => a.depth - b.depth);

//     // Ocean waves (multiple layers)
//     waves = [];
//     const waterStart = p5.height * 0.55;
//     for (let i = 0; i < 6; i++) {
//       const yPos = waterStart + i * 40;
//       const amplitude = 8 + i * 2;
//       const frequency = 0.01 + i * 0.002;
//       const speed = 150 + i * 30;
//       const depth = i / 6;
//       waves.push(new Wave(p5, yPos, amplitude, frequency, speed, depth));
//     }

//     // Marine life
//     boats = [];
//     fish = [];
//     for (let i = 0; i < 15; i++) {
//       fish.push(new Fish(p5));
//     }

//     bubbles = [];
//     seagulls = [];

//     clouds = [];
//     for (let i = 0; i < 12; i++) {
//       clouds.push(new DetailedCloud(p5));
//     }

//     birds = [];
//     leaves = [];
//     raindrops = [];
//     lightningFlashes = [];
//   };

//   const draw = (p5) => {
//     time += 0.01;

//     if (isLoading) {
//       drawCoastalLoadingScreen(p5);
//       loadingProgress += 0.012;
//       if (loadingProgress >= 1) {
//         isLoading = false;
//       }
//       return;
//     }

//     currentSentiment = p5.lerp(currentSentiment, sentiment, 0.035);
//     const timeOfDay = p5.map(currentSentiment, -1, 1, 0.35, 1);

//     // Sky
//     drawDetailedSky(p5, currentSentiment, timeOfDay);
//     drawSun(p5, currentSentiment, timeOfDay);

//     // Clouds
//     clouds.forEach((cloud) => {
//       cloud.update(currentSentiment);
//       cloud.draw(p5, currentSentiment, timeOfDay);
//     });

//     // Lightning
//     if (
//       currentSentiment < -0.65 &&
//       p5.frameCount % 80 === 0 &&
//       p5.random() < 0.4
//     ) {
//       lightningFlashes.push(new Lightning(p5));
//     }

//     lightningFlashes = lightningFlashes.filter((flash) => {
//       flash.update();
//       flash.draw(p5);
//       return !flash.isDead();
//     });

//     // Seagulls
//     if (
//       currentSentiment > -0.3 &&
//       p5.frameCount % 150 === 0 &&
//       p5.random() < 0.5
//     ) {
//       seagulls.push(new Seagull(p5));
//     }

//     seagulls = seagulls.filter((gull) => {
//       gull.update();
//       gull.draw(p5, currentSentiment);
//       return !gull.isDead(p5);
//     });

//     // Rain
//     if (currentSentiment < -0.2) {
//       const rainIntensity = p5.map(currentSentiment, -1, -0.2, 8, 25);
//       if (p5.frameCount % Math.floor(rainIntensity) === 0) {
//         raindrops.push(new Raindrop(p5));
//       }
//     }

//     raindrops = raindrops.filter((drop) => {
//       drop.update();
//       drop.draw(p5);
//       return !drop.isDead(p5);
//     });

//     // Buildings
//     buildings.forEach((building) => {
//       building.draw(p5, currentSentiment, timeOfDay);
//     });

//     // Ocean
//     drawOceanBase(p5, currentSentiment, timeOfDay);

//     // Waves
//     waves.forEach((wave) => {
//       wave.draw(p5, currentSentiment);
//     });

//     // Boats
//     if (
//       currentSentiment > -0.5 &&
//       p5.frameCount % 200 === 0 &&
//       p5.random() < 0.6
//     ) {
//       boats.push(new Boat(p5));
//     }

//     boats = boats.filter((boat) => {
//       boat.update(p5, currentSentiment);
//       boat.draw(p5, currentSentiment);
//       return !boat.isDead(p5);
//     });

//     // Fish (visible through water)
//     if (currentSentiment > 0.3) {
//       fish.forEach((f) => {
//         f.update(p5, currentSentiment);
//         f.draw(p5);
//       });
//     }

//     // Bubbles for positive sentiment
//     if (currentSentiment > 0.4 && p5.frameCount % 15 === 0) {
//       bubbles.push(new Bubble(p5));
//     }

//     bubbles = bubbles.filter((bubble) => {
//       bubble.update();
//       bubble.draw(p5);
//       return !bubble.isDead(p5);
//     });

//     // Water surface highlights
//     drawWaterHighlights(p5, currentSentiment, timeOfDay);

//     drawEnhancedHUD(p5, currentSentiment, emotion, timeOfDay);
//   };

//   const drawDetailedSky = (p5, sentiment, timeOfDay) => {
//     let skyTopHue, skyTopSat, skyTopBright;
//     let skyBotHue, skyBotSat, skyBotBright;

//     if (sentiment < -0.4) {
//       skyTopHue = 220;
//       skyTopSat = p5.map(sentiment, -1, -0.4, 35, 25);
//       skyTopBright = p5.map(sentiment, -1, -0.4, 18, 28);
//       skyBotHue = 220;
//       skyBotSat = p5.map(sentiment, -1, -0.4, 25, 18);
//       skyBotBright = p5.map(sentiment, -1, -0.4, 25, 35);
//     } else if (sentiment < 0.15) {
//       skyTopHue = 200;
//       skyTopSat = 20;
//       skyTopBright = 45;
//       skyBotHue = 195;
//       skyBotSat = 30;
//       skyBotBright = 55;
//     } else {
//       skyTopHue = p5.map(sentiment, 0.15, 1, 205, 200);
//       skyTopSat = p5.map(sentiment, 0.15, 1, 45, 65);
//       skyTopBright = p5.map(sentiment, 0.15, 1, 65, 78);
//       skyBotHue = p5.map(sentiment, 0.15, 1, 195, 185);
//       skyBotSat = p5.map(sentiment, 0.15, 1, 40, 60);
//       skyBotBright = p5.map(sentiment, 0.15, 1, 70, 85);
//     }

//     skyTopBright *= timeOfDay;
//     skyBotBright *= timeOfDay;

//     for (let y = 0; y < p5.height * 0.55; y++) {
//       const inter = y / (p5.height * 0.55);
//       const hue = p5.lerp(skyTopHue, skyBotHue, inter);
//       const sat = p5.lerp(skyTopSat, skyBotSat, inter);
//       const bright = p5.lerp(skyTopBright, skyBotBright, inter);

//       p5.stroke(hue, sat, bright);
//       p5.line(0, y, p5.width, y);
//     }
//   };

//   const drawSun = (p5, sentiment, timeOfDay) => {
//     targetSunY = p5.map(sentiment, -1, 1, -120, p5.height * 0.18);
//     sunY = p5.lerp(sunY, targetSunY, 0.04);

//     if (sunY > -50 && sunY < p5.height * 0.5) {
//       p5.push();

//       const sunX = p5.width * 0.75;
//       const sunSize = p5.map(sentiment, -0.3, 1, 70, 110);
//       const sunHue = p5.map(sentiment, -0.3, 1, 48, 52);
//       const sunSat = p5.map(sentiment, -0.3, 1, 75, 85);
//       const sunBright = p5.map(sentiment, -0.3, 1, 75, 98);

//       // Sun glow
//       for (let i = 5; i > 0; i--) {
//         const glowSize = sunSize * (1 + i * 0.25);
//         const glowOpacity = 25 / (i * 1.5);
//         p5.fill(sunHue, sunSat - 10, sunBright, glowOpacity);
//         p5.noStroke();
//         p5.ellipse(sunX, sunY, glowSize);
//       }

//       p5.fill(sunHue, sunSat, sunBright);
//       p5.ellipse(sunX, sunY, sunSize);

//       p5.fill(sunHue, sunSat - 30, 100, 180);
//       p5.ellipse(sunX - sunSize * 0.15, sunY - sunSize * 0.15, sunSize * 0.4);

//       // Sun reflection on water
//       const waterY = p5.height * 0.55;
//       if (sentiment > 0.2) {
//         p5.fill(sunHue, sunSat, sunBright, 80);
//         for (let i = 0; i < 5; i++) {
//           const refY = waterY + i * 30;
//           const refSize = sunSize * (0.8 - i * 0.1);
//           const wobble = p5.sin(time * 2 + i) * 10;
//           p5.ellipse(sunX + wobble, refY, refSize, refSize * 0.5);
//         }
//       }

//       p5.pop();
//     }
//   };

//   const drawOceanBase = (p5, sentiment, timeOfDay) => {
//     const waterStart = p5.height * 0.55;

//     // Ocean gradient
//     for (let y = waterStart; y < p5.height; y++) {
//       const inter = (y - waterStart) / (p5.height - waterStart);

//       let waterHue = p5.map(sentiment, -1, 1, 205, 185);
//       let waterSat = p5.map(sentiment, -1, 1, 50, 75);
//       let waterTopBright = p5.map(sentiment, -1, 1, 35, 52) * timeOfDay;
//       let waterBotBright = p5.map(sentiment, -1, 1, 18, 28) * timeOfDay;

//       const bright = p5.lerp(waterTopBright, waterBotBright, inter);
//       p5.stroke(waterHue, waterSat, bright);
//       p5.line(0, y, p5.width, y);
//     }
//   };

//   const drawWaterHighlights = (p5, sentiment, timeOfDay) => {
//     if (sentiment < 0.3 || timeOfDay < 0.6) return;

//     p5.push();
//     p5.noStroke();

//     // Sparkles on water
//     for (let i = 0; i < 20; i++) {
//       const x = p5.random(p5.width);
//       const y = p5.random(p5.height * 0.55, p5.height * 0.7);
//       const sparkle = p5.noise(x * 0.01, y * 0.01, time * 2);

//       if (sparkle > 0.7) {
//         const size = p5.random(2, 6);
//         const brightness = p5.map(sparkle, 0.7, 1, 70, 100);
//         p5.fill(50, 30, brightness, 180);
//         p5.ellipse(x, y, size);
//       }
//     }

//     p5.pop();
//   };

//   const drawCoastalLoadingScreen = (p5) => {
//     p5.background(15, 25, 22);

//     const progress = p5.easeOutCubic(loadingProgress);

//     // Water rising
//     const waterY = p5.height * (1 - progress * 0.45);
//     p5.fill(190, 70, 35);
//     p5.noStroke();
//     p5.rect(0, waterY, p5.width, p5.height - waterY);

//     // Buildings rising
//     for (let i = 0; i < 12; i++) {
//       const x = p5.map(i, 0, 11, p5.width * 0.1, p5.width * 0.9);
//       const maxHeight = p5.height * (0.2 + (i % 4) * 0.08);
//       const height = maxHeight * progress;
//       const width = p5.random(30, 60);

//       p5.fill(0, 0, 15);
//       p5.rect(x, waterY - height, width, height);

//       // Windows appearing
//       if (progress > 0.5) {
//         const windowProgress = p5.map(progress, 0.5, 1, 0, 1);
//         const rows = Math.floor((height / 20) * windowProgress);
//         for (let r = 0; r < rows; r++) {
//           if (p5.random() > 0.3) {
//             p5.fill(50, 40, 70, 200);
//             p5.rect(x + width * 0.3, waterY - height + r * 20 + 5, 6, 8);
//           }
//         }
//       }
//     }

//     // Waves appearing
//     if (progress > 0.3) {
//       p5.noFill();
//       p5.stroke(190, 50, 50, 150);
//       p5.strokeWeight(2);
//       for (let i = 0; i < 3; i++) {
//         p5.beginShape();
//         for (let x = 0; x <= p5.width; x += 20) {
//           const y = waterY + i * 30 + p5.sin(x * 0.02 + time * 3) * 10;
//           p5.vertex(x, y);
//         }
//         p5.endShape();
//       }
//     }

//     // Title
//     p5.textAlign(p5.CENTER, p5.CENTER);
//     p5.fill(255, 255, 255, 230);
//     p5.textSize(42);
//     p5.textStyle(p5.BOLD);
//     p5.text("COASTAL METROPOLIS", p5.width / 2, p5.height * 0.3);

//     // Subtitle
//     p5.textSize(18);
//     p5.textStyle(p5.NORMAL);
//     p5.fill(255, 255, 255, 180);
//     p5.text("Where City Meets Ocean", p5.width / 2, p5.height * 0.35);

//     // Progress bar
//     const barWidth = 400;
//     const barHeight = 6;
//     const barX = p5.width / 2 - barWidth / 2;
//     const barY = p5.height * 0.42;

//     p5.fill(255, 255, 255, 30);
//     p5.noStroke();
//     p5.rect(barX, barY, barWidth, barHeight, 3);

//     const fillWidth = barWidth * progress;
//     for (let i = 0; i < fillWidth; i++) {
//       const bright = p5.map(i, 0, fillWidth, 60, 85);
//       p5.stroke(190, 60, bright, 220);
//       p5.line(barX + i, barY, barX + i, barY + barHeight);
//     }

//     p5.noStroke();
//     p5.fill(255, 255, 255, 200);
//     p5.textSize(18);
//     p5.text(`${Math.floor(progress * 100)}%`, p5.width / 2, barY + 30);

//     let statusText = "Initializing...";
//     if (progress > 0.25) statusText = "Building skyline...";
//     if (progress > 0.5) statusText = "Filling ocean...";
//     if (progress > 0.75) statusText = "Adding marine life...";
//     if (progress > 0.95) statusText = "Ready to explore!";

//     p5.textSize(14);
//     p5.fill(255, 255, 255, 160);
//     p5.text(statusText, p5.width / 2, barY + 55);
//   };

//   const drawEnhancedHUD = (p5, sentiment, emotion, timeOfDay) => {
//     p5.push();

//     p5.fill(0, 0, 0, 180);
//     p5.noStroke();
//     p5.rect(0, p5.height - 80, p5.width, 80);

//     p5.stroke(255, 255, 255, 70);
//     p5.strokeWeight(1);
//     p5.line(0, p5.height - 80, p5.width, p5.height - 80);

//     p5.textAlign(p5.LEFT, p5.CENTER);
//     p5.noStroke();

//     let emoji = "😐";
//     let weatherIcon = "☁️";
//     let weatherText = "Overcast";
//     let oceanState = "🌊 Moderate Seas";

//     if (sentiment < -0.65) {
//       emoji = "😢";
//       weatherIcon = "⛈️";
//       weatherText = "Stormy";
//       oceanState = "🌊 Rough Seas";
//     } else if (sentiment < -0.25) {
//       emoji = "😕";
//       weatherIcon = "🌧️";
//       weatherText = "Rainy";
//       oceanState = "🌊 Choppy Waters";
//     } else if (sentiment > 0.6) {
//       emoji = "😄";
//       weatherIcon = "☀️";
//       weatherText = "Sunny";
//       oceanState = "🌊 Calm Waters";
//     } else if (sentiment > 0.25) {
//       emoji = "🙂";
//       weatherIcon = "⛅";
//       weatherText = "Partly Cloudy";
//       oceanState = "🌊 Gentle Waves";
//     }

//     // Left panel
//     p5.fill(255, 255, 255, 240);
//     p5.textSize(20);
//     p5.text(`${emoji} ${emotion.toUpperCase()}`, 30, p5.height - 50);

//     p5.textSize(14);
//     p5.fill(255, 255, 255, 200);
//     p5.text(oceanState, 30, p5.height - 25);

//     // Center panel
//     p5.textAlign(p5.CENTER);
//     p5.textSize(20);
//     p5.fill(255, 255, 255, 230);
//     p5.text(`${weatherIcon} ${weatherText}`, p5.width / 2, p5.height - 50);

//     p5.textSize(14);
//     p5.fill(255, 255, 255, 180);
//     p5.text(`Sentiment: ${sentiment.toFixed(3)}`, p5.width / 2, p5.height - 25);

//     // Right panel
//     p5.textAlign(p5.RIGHT);
//     p5.textSize(14);
//     p5.fill(255, 255, 255, 200);
//     const timeText =
//       timeOfDay > 0.7
//         ? "☀️ Midday"
//         : timeOfDay > 0.5
//         ? "🌅 Evening"
//         : "🌙 Night";
//     p5.text(timeText, p5.width - 30, p5.height - 50);

//     p5.text(
//       `🐟 ${fish.length} Fish  🚢 ${boats.length} Boats`,
//       p5.width - 30,
//       p5.height - 25
//     );

//     p5.pop();
//   };

//   const windowResized = (p5) => {
//     p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
//     generateScene(p5);
//   };

//   return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
// }

// export default AuraVisualization;

//2222222222222222222222222222222222222222
import React from "react";
import Sketch from "react-p5";

let buildings = [];
let waves = [];
let boats = [];
let fish = [];
let bubbles = [];
let seagulls = [];
let raindrops = [];
let lightningFlashes = [];
let clouds = [];
let waterSurface;
let time = 0;
let currentSentiment = 0;
let sunY = 0;
let targetSunY = 0;
let loadingProgress = 0;
let isLoading = true;

class DetailedBuilding {
  constructor(p5, x, width, height, depth, type) {
    this.x = x;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.baseY = p5.height * 0.55;
    this.type = type;

    this.actualWidth = width * (0.6 + depth * 0.4);
    this.actualHeight = height * (0.7 + depth * 0.3);

    this.windowWidth = 8;
    this.windowHeight = 12;
    this.windowSpacingX = 14;
    this.windowSpacingY = 20;
    this.cols = Math.floor(this.actualWidth / this.windowSpacingX);
    this.rows = Math.floor(this.actualHeight / this.windowSpacingY);

    this.windowPattern = [];
    for (let i = 0; i < this.rows * this.cols; i++) {
      this.windowPattern.push({
        lit: p5.random() > 0.4,
        flicker: p5.random(0.8, 1.2),
        flickerSpeed: p5.random(0.5, 2),
      });
    }

    this.hasSpire = this.type === "skyscraper" && p5.random() > 0.5;
    this.hasAntenna = this.type === "skyscraper" && p5.random() > 0.6;
    this.roofStyle = Math.floor(p5.random(3));
    this.accentColor = p5.random(["blue", "red", "green", "white"]);

    this.sections = [];
    let currentHeight = 0;
    while (currentHeight < this.actualHeight) {
      const sectionHeight = p5.random(
        this.actualHeight * 0.2,
        this.actualHeight * 0.4
      );
      const sectionWidth = this.actualWidth * p5.random(0.85, 1);
      this.sections.push({
        height: Math.min(sectionHeight, this.actualHeight - currentHeight),
        width: sectionWidth,
        offset: (this.actualWidth - sectionWidth) / 2,
      });
      currentHeight += sectionHeight;
    }
  }

  draw(p5, sentiment, timeOfDay) {
    p5.push();

    let buildingHue = 220;
    let buildingSat = p5.map(sentiment, -1, 1, 8, 18);
    let buildingBright = p5.map(sentiment, -1, 1, 18, 38);

    buildingBright *= timeOfDay;
    buildingSat *= 1 - this.depth * 0.3;
    buildingBright = p5.lerp(buildingBright, 60, this.depth * 0.4);

    let yPos = this.baseY - this.actualHeight;

    this.sections.forEach((section, idx) => {
      const sectionBright = buildingBright + (idx % 2) * 2;
      p5.fill(buildingHue, buildingSat, sectionBright);
      p5.stroke(buildingHue, buildingSat, sectionBright - 10);
      p5.strokeWeight(1 + this.depth);

      const sectionX = this.x + section.offset;
      p5.rect(sectionX, yPos, section.width, section.height);

      if (this.depth > 0.5) {
        p5.fill(buildingHue, buildingSat, sectionBright - 8);
        p5.beginShape();
        p5.vertex(sectionX + section.width, yPos);
        p5.vertex(sectionX + section.width + 8, yPos + 5);
        p5.vertex(sectionX + section.width + 8, yPos + section.height + 5);
        p5.vertex(sectionX + section.width, yPos + section.height);
        p5.endShape(p5.CLOSE);
      }

      yPos += section.height;
    });

    this.drawWindows(p5, sentiment, timeOfDay, buildingHue);
    this.drawRoof(p5, sentiment, timeOfDay, buildingBright);

    if (this.depth > 0.6) {
      this.drawAccents(p5, sentiment);
    }

    this.drawReflection(
      p5,
      sentiment,
      timeOfDay,
      buildingHue,
      buildingSat,
      buildingBright
    );

    p5.pop();
  }

  drawWindows(p5, sentiment, timeOfDay, buildingHue) {
    const glowIntensity = p5.map(timeOfDay, 0.3, 1, 1, 0.3);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const idx = row * this.cols + col;
        if (idx >= this.windowPattern.length) continue;

        const window = this.windowPattern[idx];
        if (!window.lit) continue;

        const wx = this.x + col * this.windowSpacingX + 3;
        const wy =
          this.baseY - this.actualHeight + row * this.windowSpacingY + 4;

        const flicker =
          p5.noise(idx * 0.1, time * window.flickerSpeed) * 0.2 + 0.8;

        let windowHue = 50;
        let windowSat = 30;
        let windowBright =
          p5.map(sentiment, -1, 1, 50, 85) * glowIntensity * flicker;

        if (this.depth > 0.7 && windowBright > 60) {
          p5.fill(windowHue, windowSat - 10, windowBright + 10, 100);
          p5.noStroke();
          p5.rect(wx - 2, wy - 2, this.windowWidth + 4, this.windowHeight + 4);
        }

        p5.fill(windowHue, windowSat, windowBright);
        p5.noStroke();
        p5.rect(wx, wy, this.windowWidth, this.windowHeight);

        p5.fill(
          windowHue,
          windowSat - 20,
          Math.min(100, windowBright + 15),
          150
        );
        p5.rect(wx, wy, this.windowWidth, this.windowHeight * 0.4);

        p5.stroke(buildingHue, 10, 25);
        p5.strokeWeight(0.5);
        p5.noFill();
        p5.rect(wx, wy, this.windowWidth, this.windowHeight);
      }
    }
  }

  drawRoof(p5, sentiment, timeOfDay, buildingBright) {
    const roofY = this.baseY - this.actualHeight;

    p5.stroke(220, 10, buildingBright - 10);
    p5.strokeWeight(1);

    if (this.roofStyle === 0) {
      p5.fill(220, 15, buildingBright + 5);
      p5.rect(this.x, roofY - 8, this.actualWidth, 8);

      if (this.depth > 0.6) {
        p5.fill(220, 10, buildingBright - 5);
        p5.rect(this.x + 10, roofY - 15, 15, 7);
        p5.rect(this.x + this.actualWidth - 25, roofY - 15, 15, 7);
      }
    } else if (this.roofStyle === 1) {
      p5.fill(220, 15, buildingBright + 3);
      p5.triangle(
        this.x,
        roofY,
        this.x + this.actualWidth / 2,
        roofY - 20,
        this.x + this.actualWidth,
        roofY
      );
    }

    if (this.hasSpire) {
      p5.fill(220, 20, buildingBright + 10);
      p5.triangle(
        this.x + this.actualWidth / 2 - 5,
        roofY,
        this.x + this.actualWidth / 2,
        roofY - 40,
        this.x + this.actualWidth / 2 + 5,
        roofY
      );

      const spireLight = p5.map(sentiment, -1, 1, 50, 90);
      p5.fill(this.accentColor === "red" ? 0 : 220, 80, spireLight);
      p5.noStroke();
      p5.ellipse(this.x + this.actualWidth / 2, roofY - 40, 6, 6);
    }

    if (this.hasAntenna) {
      p5.stroke(0, 0, buildingBright + 15);
      p5.strokeWeight(2);
      p5.line(
        this.x + this.actualWidth / 2,
        roofY - 5,
        this.x + this.actualWidth / 2,
        roofY - 60
      );

      p5.fill(0, 90, 60);
      p5.noStroke();
      if (p5.frameCount % 60 < 30) {
        p5.ellipse(this.x + this.actualWidth / 2, roofY - 60, 4, 4);
      }
    }
  }

  drawAccents(p5, sentiment) {
    const entranceY = this.baseY - 30;
    p5.fill(220, 25, 15);
    p5.rect(
      this.x + this.actualWidth * 0.3,
      entranceY,
      this.actualWidth * 0.4,
      30
    );

    p5.fill(50, 40, 70);
    p5.noStroke();
    p5.ellipse(this.x + this.actualWidth / 2, entranceY + 15, 8, 8);
  }

  drawReflection(
    p5,
    sentiment,
    timeOfDay,
    buildingHue,
    buildingSat,
    buildingBright
  ) {
    if (this.depth < 0.4) return;

    const waterY = p5.height * 0.55;
    const reflectionHeight = this.actualHeight * 0.6;
    const distortion = Math.abs(sentiment) * 8;

    p5.push();
    p5.translate(0, waterY);

    for (let y = 0; y < reflectionHeight; y += 3) {
      const waveOffset = p5.sin(time * 2 + y * 0.05) * distortion;
      const alpha = p5.map(y, 0, reflectionHeight, 100, 0);

      p5.fill(buildingHue, buildingSat, buildingBright - 10, alpha);
      p5.noStroke();
      p5.rect(this.x + waveOffset, y, this.actualWidth, 3);
    }

    p5.pop();
  }
}

class Wave {
  constructor(p5, layer) {
    this.layer = layer;
    this.offset = p5.random(1000);
    this.points = [];
    this.foamParticles = [];

    for (let x = 0; x <= p5.width + 100; x += 5) {
      this.points.push({
        x: x,
        baseY: 0,
        y: 0,
      });
    }
  }

  update(p5, sentiment, waterStart) {
    const intensity = Math.abs(sentiment);
    const waveHeight = (5 + this.layer * 12) * (1 + intensity * 2);
    const waveSpeed = 0.02 * (1 + intensity * 0.5);

    this.points.forEach((point) => {
      const x = point.x;

      const noise1 = p5.noise(
        x * 0.003 + time * waveSpeed + this.offset,
        this.layer
      );
      const noise2 = p5.noise(
        x * 0.008 + time * waveSpeed * 2 + this.offset,
        this.layer * 2
      );
      const noise3 = p5.noise(
        x * 0.015 + time * waveSpeed * 4 + this.offset,
        this.layer * 3
      );

      const wave = (noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1) * 2 - 1;

      point.baseY = waterStart + this.layer * 80;
      point.y = point.baseY + wave * waveHeight;

      point.x -= 0.2 * (1 + intensity * 0.5);
      if (point.x < -100) {
        point.x = p5.width + 100;
      }
    });

    if (sentiment < -0.3 && p5.frameCount % 3 === 0) {
      this.points.forEach((point) => {
        if (point.y < point.baseY - waveHeight * 0.5 && p5.random() < 0.1) {
          this.foamParticles.push({
            x: point.x,
            y: point.y,
            size: p5.random(2, 6),
            life: 1.0,
            vx: p5.random(-1, 1),
            vy: p5.random(-0.5, 0.5),
          });
        }
      });
    }

    this.foamParticles = this.foamParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      return particle.life > 0;
    });
  }

  draw(p5, sentiment, timeOfDay) {
    p5.push();

    let waveHue = p5.map(sentiment, -1, 1, 200, 185);
    let waveSat = p5.map(sentiment, -1, 1, 55, 75);
    let waveBright = p5.map(this.layer, 0, 1, 48, 35) * timeOfDay;

    p5.fill(waveHue, waveSat, waveBright, 200);
    p5.noStroke();

    p5.beginShape();
    this.points.forEach((point) => {
      p5.curveVertex(point.x, point.y);
    });
    p5.vertex(p5.width + 100, p5.height);
    p5.vertex(-100, p5.height);
    p5.endShape(p5.CLOSE);

    if (this.layer < 0.3) {
      p5.stroke(waveHue, waveSat - 20, waveBright + 15, 120);
      p5.strokeWeight(2);
      p5.noFill();
      p5.beginShape();
      this.points.forEach((point) => {
        p5.curveVertex(point.x, point.y - 1);
      });
      p5.endShape();
    }

    if (sentiment < -0.3) {
      this.foamParticles.forEach((particle) => {
        p5.fill(0, 0, 100, particle.life * 200);
        p5.noStroke();
        p5.ellipse(particle.x, particle.y, particle.size * particle.life);
      });
    }

    p5.pop();
  }
}

class WaterSurface {
  constructor(p5) {
    this.sparkles = [];
    this.causticLines = [];

    for (let i = 0; i < 30; i++) {
      this.causticLines.push({
        points: this.generateCausticLine(p5),
        phase: p5.random(p5.TWO_PI),
        speed: p5.random(0.01, 0.03),
      });
    }
  }

  generateCausticLine(p5) {
    const points = [];
    const startX = p5.random(p5.width);
    const startY = p5.random(p5.height * 0.55, p5.height * 0.75);

    for (let i = 0; i < 5; i++) {
      points.push({
        x: startX + p5.random(-30, 30),
        y: startY + i * p5.random(20, 40),
      });
    }
    return points;
  }

  update(p5, sentiment) {
    this.causticLines.forEach((line) => {
      line.phase += line.speed;
      line.points.forEach((point) => {
        point.x += p5.sin(line.phase) * 0.3;
      });
    });

    if (sentiment > 0.3 && p5.frameCount % 5 === 0) {
      const x = p5.random(p5.width);
      const y = p5.random(p5.height * 0.55, p5.height * 0.65);
      const sparkle = p5.noise(x * 0.01, y * 0.01, time * 2);

      if (sparkle > 0.65) {
        this.sparkles.push({
          x: x,
          y: y,
          size: p5.random(3, 8),
          life: 1.0,
          twinkle: p5.random(p5.TWO_PI),
        });
      }
    }

    this.sparkles = this.sparkles.filter((sparkle) => {
      sparkle.life -= 0.05;
      sparkle.twinkle += 0.2;
      return sparkle.life > 0;
    });
  }

  draw(p5, sentiment, timeOfDay) {
    p5.push();

    if (sentiment > 0 && timeOfDay > 0.6) {
      this.causticLines.forEach((line) => {
        const brightness = p5.map(p5.sin(line.phase), -1, 1, 40, 65);
        p5.stroke(180, 40, brightness, 80);
        p5.strokeWeight(1.5);
        p5.noFill();

        p5.beginShape();
        line.points.forEach((point) => {
          p5.curveVertex(point.x, point.y);
        });
        p5.endShape();
      });
    }

    this.sparkles.forEach((sparkle) => {
      const size =
        sparkle.size * sparkle.life * (1 + p5.sin(sparkle.twinkle) * 0.3);
      const brightness = 90 + p5.sin(sparkle.twinkle) * 10;

      p5.fill(50, 20, brightness, sparkle.life * 200);
      p5.noStroke();

      p5.push();
      p5.translate(sparkle.x, sparkle.y);
      p5.beginShape();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * p5.TWO_PI;
        const radius = i % 2 === 0 ? size : size * 0.4;
        p5.vertex(p5.cos(angle) * radius, p5.sin(angle) * radius);
      }
      p5.endShape(p5.CLOSE);
      p5.pop();

      p5.fill(50, 10, brightness, sparkle.life * 80);
      p5.ellipse(sparkle.x, sparkle.y, size * 2);
    });

    p5.pop();
  }
}

class Boat {
  constructor(p5) {
    this.x = p5.random() < 0.5 ? -100 : p5.width + 100;
    this.y = p5.random(p5.height * 0.58, p5.height * 0.68);
    this.speed = this.x < 0 ? p5.random(0.5, 1.5) : p5.random(-1.5, -0.5);
    this.size = p5.random(40, 70);
    this.bobPhase = p5.random(p5.TWO_PI);
    this.type = p5.random(["sail", "cargo", "yacht"]);
    this.sailColor = p5.random([0, 50, 190, 280]);
  }

  update(p5, sentiment) {
    this.x += this.speed;
    this.bobPhase += 0.02;

    const waveIntensity = Math.abs(sentiment);
    this.y += p5.sin(this.bobPhase) * 0.2 * (1 + waveIntensity);
  }

  draw(p5, sentiment) {
    p5.push();
    p5.translate(this.x, this.y);
    if (this.speed < 0) p5.scale(-1, 1);

    p5.fill(220, 15, 35);
    p5.stroke(220, 15, 25);
    p5.strokeWeight(2);
    p5.beginShape();
    p5.vertex(0, 0);
    p5.vertex(this.size, 0);
    p5.vertex(this.size * 0.9, this.size * 0.3);
    p5.vertex(this.size * 0.1, this.size * 0.3);
    p5.endShape(p5.CLOSE);

    if (this.type === "cargo" || this.type === "yacht") {
      p5.fill(220, 20, 45);
      p5.rect(
        this.size * 0.3,
        -this.size * 0.2,
        this.size * 0.4,
        this.size * 0.2
      );
    }

    if (this.type === "sail") {
      p5.fill(this.sailColor, 70, 85, 200);
      p5.noStroke();
      p5.triangle(
        this.size * 0.5,
        -this.size * 0.1,
        this.size * 0.5,
        -this.size * 1.2,
        this.size * 0.8,
        -this.size * 0.1
      );

      p5.stroke(30, 30, 30);
      p5.strokeWeight(3);
      p5.line(this.size * 0.5, 0, this.size * 0.5, -this.size * 1.3);
    }

    if (this.type !== "sail") {
      p5.fill(50, 60, 80);
      p5.noStroke();
      for (let i = 0; i < 3; i++) {
        p5.rect(
          this.size * (0.35 + i * 0.12),
          -this.size * 0.15,
          this.size * 0.08,
          this.size * 0.08
        );
      }
    }

    p5.push();
    p5.scale(1, -0.4);
    p5.translate(0, -this.size * 0.6);
    p5.fill(220, 15, 25, 60);
    p5.noStroke();
    p5.beginShape();
    p5.vertex(0, 0);
    p5.vertex(this.size, 0);
    p5.vertex(this.size * 0.9, this.size * 0.3);
    p5.vertex(this.size * 0.1, this.size * 0.3);
    p5.endShape(p5.CLOSE);
    p5.pop();

    p5.pop();
  }

  isDead(p5) {
    return this.x < -150 || this.x > p5.width + 150;
  }
}

class Fish {
  constructor(p5) {
    this.x = p5.random(p5.width);
    this.y = p5.random(p5.height * 0.6, p5.height * 0.85);
    this.speedX = p5.random(-1, 1);
    this.speedY = p5.random(-0.3, 0.3);
    this.size = p5.random(8, 20);
    this.tailPhase = p5.random(p5.TWO_PI);
    this.depth = p5.random(0.3, 1);
    this.hue = p5.random([30, 180, 280]);
  }

  update(p5, sentiment) {
    const activity = p5.map(sentiment, -1, 1, 0.3, 1.5);

    this.x += this.speedX * activity;
    this.y += this.speedY * activity;
    this.tailPhase += 0.2;

    if (this.x < 0 || this.x > p5.width) this.speedX *= -1;
    if (this.y < p5.height * 0.58 || this.y > p5.height * 0.9)
      this.speedY *= -1;

    if (p5.random() < 0.02) {
      this.speedX += p5.random(-0.2, 0.2);
      this.speedY += p5.random(-0.1, 0.1);
    }
  }

  draw(p5) {
    p5.push();
    p5.translate(this.x, this.y);
    if (this.speedX < 0) p5.scale(-1, 1);

    const alpha = this.depth * 180;

    p5.fill(this.hue, 70, 60, alpha);
    p5.noStroke();
    p5.ellipse(0, 0, this.size, this.size * 0.5);

    const tailSwing = p5.sin(this.tailPhase) * 0.3;
    p5.push();
    p5.rotate(tailSwing);
    p5.triangle(
      -this.size * 0.5,
      0,
      -this.size * 0.9,
      -this.size * 0.3,
      -this.size * 0.9,
      this.size * 0.3
    );
    p5.pop();

    p5.fill(0, 0, 0, alpha);
    p5.ellipse(this.size * 0.3, -this.size * 0.1, this.size * 0.15);

    p5.pop();
  }
}

class Bubble {
  constructor(p5) {
    this.x = p5.random(p5.width);
    this.y = p5.height * 0.9;
    this.size = p5.random(3, 12);
    this.speed = p5.random(0.5, 2);
    this.wobble = p5.random(p5.TWO_PI);
    this.wobbleSpeed = p5.random(0.02, 0.05);
  }

  update() {
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.5;
  }

  draw(p5) {
    p5.push();
    p5.noFill();
    p5.stroke(190, 40, 80, 120);
    p5.strokeWeight(1.5);
    p5.ellipse(this.x, this.y, this.size);

    p5.fill(190, 20, 95, 100);
    p5.noStroke();
    p5.ellipse(
      this.x - this.size * 0.2,
      this.y - this.size * 0.2,
      this.size * 0.3
    );
    p5.pop();
  }

  isDead(p5) {
    return this.y < p5.height * 0.55;
  }
}

class Seagull {
  constructor(p5) {
    this.x = p5.random() < 0.5 ? -50 : p5.width + 50;
    this.y = p5.random(p5.height * 0.2, p5.height * 0.45);
    this.speedX = this.x < 0 ? p5.random(2, 4) : p5.random(-4, -2);
    this.speedY = p5.random(-0.5, 0.5);
    this.wingPhase = p5.random(p5.TWO_PI);
    this.size = p5.random(12, 20);
    this.glidePhase = p5.random(100);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY + Math.sin(this.glidePhase * 0.05) * 0.3;
    this.wingPhase += 0.12;
    this.glidePhase++;
  }

  draw(p5, sentiment) {
    if (sentiment < -0.6) return;

    p5.push();
    p5.translate(this.x, this.y);
    if (this.speedX < 0) p5.scale(-1, 1);

    const wingAngle = (p5.sin(this.wingPhase) * p5.PI) / 5;

    p5.fill(0, 0, 95, 200);
    p5.noStroke();
    p5.ellipse(0, 0, this.size * 0.8, this.size * 0.5);

    p5.push();
    p5.rotate(wingAngle);
    p5.fill(0, 0, 95, 180);
    p5.beginShape();
    p5.vertex(0, 0);
    p5.bezierVertex(
      this.size * 0.4,
      -this.size * 0.2,
      this.size * 0.8,
      -this.size * 0.3,
      this.size,
      -this.size * 0.2
    );
    p5.vertex(this.size * 0.3, 0);
    p5.endShape(p5.CLOSE);
    p5.pop();

    p5.push();
    p5.rotate(-wingAngle);
    p5.fill(0, 0, 95, 180);
    p5.beginShape();
    p5.vertex(0, 0);
    p5.bezierVertex(
      -this.size * 0.4,
      -this.size * 0.2,
      -this.size * 0.8,
      -this.size * 0.3,
      -this.size,
      -this.size * 0.2
    );
    p5.vertex(-this.size * 0.3, 0);
    p5.endShape(p5.CLOSE);
    p5.pop();

    p5.fill(0, 0, 98);
    p5.ellipse(this.size * 0.4, -this.size * 0.1, this.size * 0.4);

    p5.fill(40, 70, 70);
    p5.triangle(
      this.size * 0.5,
      -this.size * 0.05,
      this.size * 0.7,
      0,
      this.size * 0.5,
      0.05 * this.size
    );

    p5.pop();
  }

  isDead(p5) {
    return this.x < -100 || this.x > p5.width + 100;
  }
}

class Raindrop {
  constructor(p5) {
    this.x = p5.random(p5.width);
    this.y = p5.random(-200, -50);
    this.speed = p5.random(15, 25);
    this.length = p5.random(15, 35);
    this.opacity = p5.random(120, 220);
    this.thickness = p5.random(1.5, 3);
  }

  update() {
    this.y += this.speed;
    this.speed += 0.2;
  }

  draw(p5) {
    p5.stroke(200, 15, 75, this.opacity);
    p5.strokeWeight(this.thickness);
    p5.line(this.x, this.y, this.x - 2, this.y + this.length);

    if (this.y > p5.height * 0.55 - 5 && this.y < p5.height * 0.55 + 5) {
      p5.stroke(200, 15, 75, this.opacity * 0.5);
      p5.strokeWeight(1);
      for (let i = 0; i < 3; i++) {
        const angle = p5.random(p5.TWO_PI);
        const dist = p5.random(3, 8);
        p5.line(
          this.x,
          this.y,
          this.x + p5.cos(angle) * dist,
          this.y + p5.sin(angle) * dist
        );
      }
    }
  }

  isDead(p5) {
    return this.y > p5.height;
  }
}

class DetailedCloud {
  constructor(p5) {
    this.x = p5.random(-300, p5.width + 300);
    this.y = p5.random(80, 280);
    this.mainSize = p5.random(120, 200);
    this.speed = p5.random(0.3, 0.8);
    this.opacity = 0;
    this.targetOpacity = p5.random(140, 220);
    this.puffs = [];

    const puffCount = Math.floor(p5.random(5, 9));
    for (let i = 0; i < puffCount; i++) {
      this.puffs.push({
        offsetX: (i - puffCount / 2) * this.mainSize * 0.35,
        offsetY: p5.random(-20, 20),
        size: this.mainSize * p5.random(0.6, 1.1),
        drift: p5.random(p5.TWO_PI),
      });
    }
  }

  update(sentiment) {
    this.x += this.speed;
    if (this.x > window.innerWidth + 300) {
      this.x = -300;
    }

    if (sentiment < -0.15) {
      this.opacity = Math.min(this.opacity + 4, this.targetOpacity);
    } else {
      this.opacity = Math.max(this.opacity - 4, 0);
    }

    this.puffs.forEach((puff) => {
      puff.drift += 0.01;
    });
  }

  draw(p5, sentiment, timeOfDay) {
    if (this.opacity <= 0) return;

    p5.push();
    p5.noStroke();

    let cloudHue = 200;
    let cloudSat = p5.map(sentiment, -1, 0, 15, 5);
    let cloudBright = p5.map(sentiment, -1, 0, 22, 70) * timeOfDay;

    this.puffs.forEach((puff, idx) => {
      const driftX = p5.sin(puff.drift) * 5;
      const driftY = p5.cos(puff.drift * 0.7) * 3;

      p5.fill(cloudHue, cloudSat, cloudBright - 10, this.opacity * 0.6);
      p5.ellipse(
        this.x + puff.offsetX + driftX + 5,
        this.y + puff.offsetY + driftY + 5,
        puff.size,
        puff.size * 0.75
      );

      p5.fill(cloudHue, cloudSat, cloudBright + (idx % 2) * 3, this.opacity);
      p5.ellipse(
        this.x + puff.offsetX + driftX,
        this.y + puff.offsetY + driftY,
        puff.size,
        puff.size * 0.75
      );

      p5.fill(
        cloudHue,
        cloudSat - 5,
        Math.min(100, cloudBright + 15),
        this.opacity * 0.4
      );
      p5.ellipse(
        this.x + puff.offsetX + driftX - puff.size * 0.15,
        this.y + puff.offsetY + driftY - puff.size * 0.15,
        puff.size * 0.5,
        puff.size * 0.35
      );
    });

    p5.pop();
  }
}

class Lightning {
  constructor(p5) {
    this.startX = p5.random(p5.width * 0.2, p5.width * 0.8);
    this.branches = [];
    this.opacity = 255;
    this.duration = 8;

    this.generateBolt(
      p5,
      this.startX,
      50,
      p5.random(20, 50),
      p5.height * 0.55,
      0,
      this.branches
    );
  }

  generateBolt(p5, x, y, endX, endY, depth, array) {
    if (depth > 4) return;

    const segments = Math.floor(p5.random(5, 10));
    let currentX = x;
    let currentY = y;

    for (let i = 0; i < segments; i++) {
      const nextX = p5.lerp(x, endX, (i + 1) / segments) + p5.random(-25, 25);
      const nextY = p5.lerp(y, endY, (i + 1) / segments) + p5.random(-15, 15);

      array.push({
        x1: currentX,
        y1: currentY,
        x2: nextX,
        y2: nextY,
        thickness: 4 - depth,
      });

      if (p5.random() < 0.3 && depth < 3) {
        const branchEndX = nextX + p5.random(-80, 80);
        const branchEndY = nextY + p5.random(50, 150);
        this.generateBolt(
          p5,
          nextX,
          nextY,
          branchEndX,
          branchEndY,
          depth + 1,
          array
        );
      }

      currentX = nextX;
      currentY = nextY;
    }
  }

  update() {
    this.duration--;
    this.opacity = this.duration * 30;
  }

  draw(p5) {
    p5.push();

    for (let glow = 3; glow > 0; glow--) {
      this.branches.forEach((segment) => {
        p5.stroke(55, 15, 95, (this.opacity * 0.2) / glow);
        p5.strokeWeight(segment.thickness + glow * 4);
        p5.line(segment.x1, segment.y1, segment.x2, segment.y2);
      });
    }

    this.branches.forEach((segment) => {
      p5.stroke(55, 5, 100, this.opacity);
      p5.strokeWeight(segment.thickness);
      p5.line(segment.x1, segment.y1, segment.x2, segment.y2);
    });

    p5.fill(200, 10, 90, this.opacity * 0.15);
    p5.noStroke();
    p5.rect(0, 0, p5.width, p5.height);

    p5.pop();
  }

  isDead() {
    return this.duration <= 0;
  }
}

function AuraVisualization({ sentiment, emotion, keywords }) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.colorMode(p5.HSL, 360, 100, 100, 255);
    p5.easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    generateScene(p5);
  };

  const generateScene = (p5) => {
    buildings = [];
    for (let depth = 0; depth < 1; depth += 0.25) {
      let x = 30;
      const depthFactor = 1 - depth;

      while (x < p5.width - 30) {
        const width = p5.random(80, 180) * depthFactor;
        const height = p5.random(150, p5.height * 0.4) * depthFactor;
        const type = p5.random(["modern", "classic", "skyscraper"]);
        buildings.push(new DetailedBuilding(p5, x, width, height, depth, type));
        x += width + p5.random(15, 40) * depthFactor;
      }
    }
    buildings.sort((a, b) => a.depth - b.depth);

    waves = [];
    for (let i = 0; i < 8; i++) {
      const layer = i / 8;
      waves.push(new Wave(p5, layer));
    }

    waterSurface = new WaterSurface(p5);

    boats = [];
    fish = [];
    for (let i = 0; i < 15; i++) {
      fish.push(new Fish(p5));
    }

    bubbles = [];
    seagulls = [];

    clouds = [];
    for (let i = 0; i < 12; i++) {
      clouds.push(new DetailedCloud(p5));
    }

    raindrops = [];
    lightningFlashes = [];
  };

  const draw = (p5) => {
    time += 0.01;

    if (isLoading) {
      drawCoastalLoadingScreen(p5);
      loadingProgress += 0.012;
      if (loadingProgress >= 1) {
        isLoading = false;
      }
      return;
    }

    currentSentiment = p5.lerp(currentSentiment, sentiment, 0.035);
    const timeOfDay = p5.map(currentSentiment, -1, 1, 0.35, 1);

    drawDetailedSky(p5, currentSentiment, timeOfDay);
    drawSun(p5, currentSentiment, timeOfDay);

    clouds.forEach((cloud) => {
      cloud.update(currentSentiment);
      cloud.draw(p5, currentSentiment, timeOfDay);
    });

    if (
      currentSentiment < -0.65 &&
      p5.frameCount % 80 === 0 &&
      p5.random() < 0.4
    ) {
      lightningFlashes.push(new Lightning(p5));
    }

    lightningFlashes = lightningFlashes.filter((flash) => {
      flash.update();
      flash.draw(p5);
      return !flash.isDead();
    });

    if (
      currentSentiment > -0.3 &&
      p5.frameCount % 150 === 0 &&
      p5.random() < 0.5
    ) {
      seagulls.push(new Seagull(p5));
    }

    seagulls = seagulls.filter((gull) => {
      gull.update();
      gull.draw(p5, currentSentiment);
      return !gull.isDead(p5);
    });

    if (currentSentiment < -0.2) {
      const rainIntensity = p5.map(currentSentiment, -1, -0.2, 8, 25);
      if (p5.frameCount % Math.floor(rainIntensity) === 0) {
        raindrops.push(new Raindrop(p5));
      }
    }

    raindrops = raindrops.filter((drop) => {
      drop.update();
      drop.draw(p5);
      return !drop.isDead(p5);
    });

    buildings.forEach((building) => {
      building.draw(p5, currentSentiment, timeOfDay);
    });

    drawRealisticOcean(p5, currentSentiment, timeOfDay);

    const waterStart = p5.height * 0.55;
    waves.forEach((wave) => {
      wave.update(p5, currentSentiment, waterStart);
      wave.draw(p5, currentSentiment, timeOfDay);
    });

    waterSurface.update(p5, currentSentiment);
    waterSurface.draw(p5, currentSentiment, timeOfDay);

    if (
      currentSentiment > -0.5 &&
      p5.frameCount % 200 === 0 &&
      p5.random() < 0.6
    ) {
      boats.push(new Boat(p5));
    }

    boats = boats.filter((boat) => {
      boat.update(p5, currentSentiment);
      boat.draw(p5, currentSentiment);
      return !boat.isDead(p5);
    });

    if (currentSentiment > 0.3) {
      fish.forEach((f) => {
        f.update(p5, currentSentiment);
        f.draw(p5);
      });
    }

    if (currentSentiment > 0.4 && p5.frameCount % 15 === 0) {
      bubbles.push(new Bubble(p5));
    }

    bubbles = bubbles.filter((bubble) => {
      bubble.update();
      bubble.draw(p5);
      return !bubble.isDead(p5);
    });

    drawEnhancedHUD(p5, currentSentiment, emotion, timeOfDay);
  };

  const drawDetailedSky = (p5, sentiment, timeOfDay) => {
    let skyTopHue, skyTopSat, skyTopBright;
    let skyBotHue, skyBotSat, skyBotBright;

    if (sentiment < -0.4) {
      skyTopHue = 220;
      skyTopSat = p5.map(sentiment, -1, -0.4, 35, 25);
      skyTopBright = p5.map(sentiment, -1, -0.4, 18, 28);
      skyBotHue = 220;
      skyBotSat = p5.map(sentiment, -1, -0.4, 25, 18);
      skyBotBright = p5.map(sentiment, -1, -0.4, 25, 35);
    } else if (sentiment < 0.15) {
      skyTopHue = 200;
      skyTopSat = 20;
      skyTopBright = 45;
      skyBotHue = 195;
      skyBotSat = 30;
      skyBotBright = 55;
    } else {
      skyTopHue = p5.map(sentiment, 0.15, 1, 205, 200);
      skyTopSat = p5.map(sentiment, 0.15, 1, 45, 65);
      skyTopBright = p5.map(sentiment, 0.15, 1, 65, 78);
      skyBotHue = p5.map(sentiment, 0.15, 1, 195, 185);
      skyBotSat = p5.map(sentiment, 0.15, 1, 40, 60);
      skyBotBright = p5.map(sentiment, 0.15, 1, 70, 85);
    }

    skyTopBright *= timeOfDay;
    skyBotBright *= timeOfDay;

    for (let y = 0; y < p5.height * 0.55; y++) {
      const inter = y / (p5.height * 0.55);
      const hue = p5.lerp(skyTopHue, skyBotHue, inter);
      const sat = p5.lerp(skyTopSat, skyBotSat, inter);
      const bright = p5.lerp(skyTopBright, skyBotBright, inter);

      p5.stroke(hue, sat, bright);
      p5.line(0, y, p5.width, y);
    }
  };

  const drawSun = (p5, sentiment, timeOfDay) => {
    targetSunY = p5.map(sentiment, -1, 1, -120, p5.height * 0.18);
    sunY = p5.lerp(sunY, targetSunY, 0.04);

    if (sunY > -50 && sunY < p5.height * 0.5) {
      p5.push();

      const sunX = p5.width * 0.75;
      const sunSize = p5.map(sentiment, -0.3, 1, 70, 110);
      const sunHue = p5.map(sentiment, -0.3, 1, 48, 52);
      const sunSat = p5.map(sentiment, -0.3, 1, 75, 85);
      const sunBright = p5.map(sentiment, -0.3, 1, 75, 98);

      for (let i = 5; i > 0; i--) {
        const glowSize = sunSize * (1 + i * 0.25);
        const glowOpacity = 25 / (i * 1.5);
        p5.fill(sunHue, sunSat - 10, sunBright, glowOpacity);
        p5.noStroke();
        p5.ellipse(sunX, sunY, glowSize);
      }

      p5.fill(sunHue, sunSat, sunBright);
      p5.ellipse(sunX, sunY, sunSize);

      p5.fill(sunHue, sunSat - 30, 100, 180);
      p5.ellipse(sunX - sunSize * 0.15, sunY - sunSize * 0.15, sunSize * 0.4);

      const waterY = p5.height * 0.55;
      if (sentiment > 0.2) {
        p5.fill(sunHue, sunSat, sunBright, 80);
        for (let i = 0; i < 5; i++) {
          const refY = waterY + i * 30;
          const refSize = sunSize * (0.8 - i * 0.1);
          const wobble = p5.sin(time * 2 + i) * 10;
          p5.ellipse(sunX + wobble, refY, refSize, refSize * 0.5);
        }
      }

      p5.pop();
    }
  };

  const drawRealisticOcean = (p5, sentiment, timeOfDay) => {
    const waterStart = p5.height * 0.55;

    // Define these variables BEFORE the loop
    let waterHue = p5.map(sentiment, -1, 1, 205, 185);
    let waterSat = p5.map(sentiment, -1, 1, 50, 75);
    let waterTopBright = p5.map(sentiment, -1, 1, 40, 55) * timeOfDay;
    let waterBotBright = p5.map(sentiment, -1, 1, 12, 22) * timeOfDay;

    for (let y = waterStart; y < p5.height; y++) {
      const inter = (y - waterStart) / (p5.height - waterStart);

      const bright = p5.lerp(waterTopBright, waterBotBright, inter * inter);
      const depthHue = p5.lerp(waterHue, waterHue - 10, inter);

      p5.stroke(depthHue, waterSat, bright);
      p5.line(0, y, p5.width, y);
    }

    p5.fill(waterHue, waterSat - 20, waterTopBright + 15, 80);
    p5.noStroke();
    p5.rect(0, waterStart, p5.width, 30);
  };

  const drawCoastalLoadingScreen = (p5) => {
    p5.background(15, 25, 22);

    const progress = p5.easeOutCubic(loadingProgress);

    const waterY = p5.height * (1 - progress * 0.45);
    p5.fill(190, 70, 35);
    p5.noStroke();
    p5.rect(0, waterY, p5.width, p5.height - waterY);

    for (let i = 0; i < 12; i++) {
      const x = p5.map(i, 0, 11, p5.width * 0.1, p5.width * 0.9);
      const maxHeight = p5.height * (0.2 + (i % 4) * 0.08);
      const height = maxHeight * progress;
      const width = p5.random(30, 60);

      p5.fill(0, 0, 15);
      p5.rect(x, waterY - height, width, height);

      if (progress > 0.5) {
        const windowProgress = p5.map(progress, 0.5, 1, 0, 1);
        const rows = Math.floor((height / 20) * windowProgress);
        for (let r = 0; r < rows; r++) {
          if (p5.random() > 0.3) {
            p5.fill(50, 40, 70, 200);
            p5.rect(x + width * 0.3, waterY - height + r * 20 + 5, 6, 8);
          }
        }
      }
    }

    if (progress > 0.3) {
      p5.noFill();
      p5.stroke(190, 50, 50, 150);
      p5.strokeWeight(2);
      for (let i = 0; i < 3; i++) {
        p5.beginShape();
        for (let x = 0; x <= p5.width; x += 20) {
          const y = waterY + i * 30 + p5.sin(x * 0.02 + time * 3) * 10;
          p5.vertex(x, y);
        }
        p5.endShape();
      }
    }

    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(255, 255, 255, 230);
    p5.textSize(42);
    p5.textStyle(p5.BOLD);
    p5.text("COASTAL METROPOLIS", p5.width / 2, p5.height * 0.3);

    p5.textSize(18);
    p5.textStyle(p5.NORMAL);
    p5.fill(255, 255, 255, 180);
    p5.text("Where City Meets Ocean", p5.width / 2, p5.height * 0.35);

    const barWidth = 400;
    const barHeight = 6;
    const barX = p5.width / 2 - barWidth / 2;
    const barY = p5.height * 0.42;

    p5.fill(255, 255, 255, 30);
    p5.noStroke();
    p5.rect(barX, barY, barWidth, barHeight, 3);

    const fillWidth = barWidth * progress;
    for (let i = 0; i < fillWidth; i++) {
      const bright = p5.map(i, 0, fillWidth, 60, 85);
      p5.stroke(190, 60, bright, 220);
      p5.line(barX + i, barY, barX + i, barY + barHeight);
    }

    p5.noStroke();
    p5.fill(255, 255, 255, 200);
    p5.textSize(18);
    p5.text(`${Math.floor(progress * 100)}%`, p5.width / 2, barY + 30);

    let statusText = "Initializing...";
    if (progress > 0.25) statusText = "Building skyline...";
    if (progress > 0.5) statusText = "Filling ocean...";
    if (progress > 0.75) statusText = "Adding marine life...";
    if (progress > 0.95) statusText = "Ready to explore!";

    p5.textSize(14);
    p5.fill(255, 255, 255, 160);
    p5.text(statusText, p5.width / 2, barY + 55);
  };

  const drawEnhancedHUD = (p5, sentiment, emotion, timeOfDay) => {
    p5.push();

    p5.fill(0, 0, 0, 180);
    p5.noStroke();
    p5.rect(0, p5.height - 80, p5.width, 80);

    p5.stroke(255, 255, 255, 70);
    p5.strokeWeight(1);
    p5.line(0, p5.height - 80, p5.width, p5.height - 80);

    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.noStroke();

    let emoji = "😐";
    let weatherIcon = "☁️";
    let weatherText = "Overcast";
    let oceanState = "🌊 Moderate Seas";

    if (sentiment < -0.65) {
      emoji = "😢";
      weatherIcon = "⛈️";
      weatherText = "Stormy";
      oceanState = "🌊 Rough Seas";
    } else if (sentiment < -0.25) {
      emoji = "😕";
      weatherIcon = "🌧️";
      weatherText = "Rainy";
      oceanState = "🌊 Choppy Waters";
    } else if (sentiment > 0.6) {
      emoji = "😄";
      weatherIcon = "☀️";
      weatherText = "Sunny";
      oceanState = "🌊 Calm Waters";
    } else if (sentiment > 0.25) {
      emoji = "🙂";
      weatherIcon = "⛅";
      weatherText = "Partly Cloudy";
      oceanState = "🌊 Gentle Waves";
    }

    p5.fill(255, 255, 255, 240);
    p5.textSize(20);
    p5.text(`${emoji} ${emotion.toUpperCase()}`, 30, p5.height - 50);

    p5.textSize(14);
    p5.fill(255, 255, 255, 200);
    p5.text(oceanState, 30, p5.height - 25);

    p5.textAlign(p5.CENTER);
    p5.textSize(20);
    p5.fill(255, 255, 255, 230);
    p5.text(`${weatherIcon} ${weatherText}`, p5.width / 2, p5.height - 50);

    p5.textSize(14);
    p5.fill(255, 255, 255, 180);
    p5.text(`Sentiment: ${sentiment.toFixed(3)}`, p5.width / 2, p5.height - 25);

    p5.textAlign(p5.RIGHT);
    p5.textSize(14);
    p5.fill(255, 255, 255, 200);
    const timeText =
      timeOfDay > 0.7
        ? "☀️ Midday"
        : timeOfDay > 0.5
        ? "🌅 Evening"
        : "🌙 Night";
    p5.text(timeText, p5.width - 30, p5.height - 50);

    p5.text(
      `🐟 ${fish.length} Fish  🚢 ${boats.length} Boats`,
      p5.width - 30,
      p5.height - 25
    );

    p5.pop();
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    generateScene(p5);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default AuraVisualization;
