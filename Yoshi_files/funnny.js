function Shw(n) {if (self.moveBy) {for (i = 35; i > 0; i--) {for (j = n; j > 0; j--) {self.moveBy(1,i);self.moveBy(i,0);self.moveBy(0,-i);self.moveBy(-i,0); } } }} Shw(6)
