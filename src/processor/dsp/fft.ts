export default (x: Float32Array|number[], y: Float32Array|number[], dir: number, normalize: boolean = true) => {
    const n = x.length;
    let i = 0;
    let i1 = 0;
    let j = 0;
    let k = 0;
    let i2 = 0;
    let l = 0;
    let l1 = 0;
    let l2 = 0;
    let c1 = 0;
    let c2 = 0;
    let tx = 0;
    let ty = 0;
    let t1 = 0;
    let t2 = 0;
    let u1 = 0;
    let u2 = 0;
    let z = 0;
    let m = Math.log2(n);
    /* Do the bit reversal */
    i2 = n >> 1;
    j = 0;
    for (i = 0; i < n - 1; i++) {
        if (i < j) {
            tx = x[i];
            ty = y[i];
            x[i] = x[j];
            y[i] = y[j];
            x[j] = tx;
            y[j] = ty;
        }
        k = i2;
        while (k <= j) {
            j -= k;
            k >>= 1;
        }
        j += k;
    }

    /* Compute the FFT */
    c1 = -1.0;
    c2 = 0.0;
    l2 = 1;
    for (l = 0; l < m; l++) {
        l1 = l2;
        l2 <<= 1;
        u1 = 1.0;
        u2 = 0.0;
        for (j = 0; j < l1; j++) {
            for (i = j; i < n; i += l2) {
                i1 = i + l1;
                t1 = u1 * x[i1] - u2 * y[i1];
                t2 = u1 * y[i1] + u2 * x[i1];
                x[i1] = x[i] - t1;
                y[i1] = y[i] - t2;
                x[i] += t1;
                y[i] += t2;
            }
            z = u1 * c1 - u2 * c2;
            u2 = u1 * c2 + u2 * c1;
            u1 = z;
        }
        c2 = Math.sqrt((1.0 - c1) / 2.0);
        if (dir === 1) { c2 = -c2 }
        c1 = Math.sqrt((1.0 + c1) / 2.0);
    }

    /* Scaling for forward transform */
    if (dir === -1 && normalize) {
        for (i = 0; i < n; i++) {
            x[i] /= n;
            y[i] /= n;
        }
    }
};