// components/RechartsWrapper.tsx
'use client';                             // ensure this module only runs in the browser (Next.js app-dir requirement)

// import everything from recharts under a single namespace so we only ever load one module instance
import * as Recharts from 'recharts';

// export the whole module as default so we can dynamic-import a single wrapper in other files
export default Recharts;
