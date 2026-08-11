(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['matrix-walk'] = {
  id: 'matrix-walk',
  name: 'Math & geometry: digit walk, safe reverse, rotate, spiral, gcd, sieve',
  pattern: 'math-geometry',
  order: 17,
  notes: 'Rotate 90 degrees clockwise = transpose, then reverse each row. Far easier to get right than moving ' +
         'four corners at a time. Digit problems are `n % 10` and `n / 10`. Check for overflow BEFORE you ' +
         'multiply, not after.',
  code: `import java.util.*;

class MathGeometryTemplate {

    /** Shape 1 - DIGIT WALK. Peel the last digit off, shrink, repeat. */
    int sumOfDigits(int n) {
        int sum = 0;
        n = Math.abs(n);
        while (n > 0) {
            sum += n % 10;      // the last digit
            n /= 10;            // drop it
        }
        return sum;
    }

    /** Shape 2 - REVERSE WITH AN OVERFLOW GUARD. Check before multiplying. */
    int reverseInteger(int n) {
        int out = 0;
        while (n != 0) {
            int digit = n % 10;
            n /= 10;
            // one more shift would blow past the int range
            if (out > Integer.MAX_VALUE / 10 || out < Integer.MIN_VALUE / 10) return 0;
            out = out * 10 + digit;
        }
        return out;
    }

    /** Shape 3 - ROTATE 90 CLOCKWISE IN PLACE: transpose, then reverse each row. */
    void rotate(int[][] m) {
        int n = m.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {          // j starts at i+1: upper triangle only
                int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
            }
        }
        for (int[] row : m) {
            for (int l = 0, r = n - 1; l < r; l++, r--) {
                int t = row[l]; row[l] = row[r]; row[r] = t;
            }
        }
    }

    /** Shape 4 - SPIRAL ORDER. Four boundaries closing inward. */
    List<Integer> spiralOrder(int[][] m) {
        List<Integer> out = new ArrayList<>();
        if (m.length == 0) return out;
        int top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) out.add(m[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) out.add(m[r][right]);
            right--;
            if (top <= bottom) {                       // guard: the row may be gone already
                for (int c = right; c >= left; c--) out.add(m[bottom][c]);
                bottom--;
            }
            if (left <= right) {                       // guard: the column may be gone already
                for (int r = bottom; r >= top; r--) out.add(m[r][left]);
                left++;
            }
        }
        return out;
    }

    /** Shape 5 - EUCLID'S GCD. Two lines, and lcm falls out of it. */
    int gcd(int a, int b) {
        while (b != 0) {
            int t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    long lcm(int a, int b) {
        return (long) a / gcd(a, b) * b;     // divide first so the multiply cannot overflow
    }

    /** Shape 6 - SIEVE OF ERATOSTHENES. All primes below n in O(n log log n). */
    List<Integer> primesBelow(int n) {
        boolean[] composite = new boolean[Math.max(n, 2)];
        List<Integer> primes = new ArrayList<>();
        for (int p = 2; p < n; p++) {
            if (composite[p]) continue;
            primes.add(p);
            // start at p*p: smaller multiples already had a smaller prime factor
            for (long q = (long) p * p; q < n; q += p) composite[(int) q] = true;
        }
        return primes;
    }

    /** Shape 7 - MODULO THAT IS NEVER NEGATIVE. Java's % is not what you want here. */
    int circularIndex(int i, int n) {
        return Math.floorMod(i, n);          // -1 becomes n-1, unlike (-1 % n) which is -1
    }
}
`
};
