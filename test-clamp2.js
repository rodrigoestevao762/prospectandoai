async function test() {
  const [s, w, n, e] = [33.65, -84.55, 33.88, -84.28];
  const maxDelta = 0.2;
  const latC = (s + n) / 2;
  const lonC = (w + e) / 2;
  
  let s_new = s, n_new = n, w_new = w, e_new = e;
  
  if (n - s > maxDelta) { s_new = latC - maxDelta/2; n_new = latC + maxDelta/2; }
  if (e - w > maxDelta) { w_new = lonC - maxDelta/2; e_new = lonC + maxDelta/2; }
  
  console.log(`Original: ${s}, ${w}, ${n}, ${e}`);
  console.log(`Clamped: ${s_new}, ${w_new}, ${n_new}, ${e_new}`);
}
test();
