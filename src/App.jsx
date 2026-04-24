import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';

// ==============================================================================
// DONNÉES
// Torsion cols: [Temps, Diametre, Maille, Long, Poids, NbRessorts,
//                Tubing, Plein, NbShaft, LongShaft, PillowBlock, Duplex]
// ==============================================================================
const TORSION_DATA = [[19,1.75,2070,25.7,15,2,1,0,1,144,0,0],[9,1.75,2187,26.5,8,1,1,0,1,84,0,0],[10,1.75,2187,25.5,8,1,1,0,1,84,0,0],[9,1.75,2437,31,11,1,1,0,1,120,0,0],[22,1.75,2253,36.8,23,2,1,0,1,132,0,0],[120,6,4375,33.9,266,4,0,1,2,189,1,0],[19,1.75,2437,34.8,12,1,1,0,1,108,0,0],[14,1.75,2070,24.3,14,2,1,0,1,144,0,0],[12,1.75,2070,24.2,14,2,1,0,1,156,0,0],[22,2.625,2830,39,45,2,0,1,2,105,0,0],[22,2.625,2830,45.8,53,2,0,1,1,162,0,0],[33,1.75,2070,28.3,16,2,1,0,1,120,0,0],[22,1.75,2625,37.9,28,2,0,1,1,162,0,0],[20,1.75,2437,44.4,30,2,0,1,1,162,0,0],[14,2.625,2625,39.3,21,1,1,0,1,108,0,0],[8,1.75,2070,21.6,43.7,1,1,0,1,84,0,0],[17,2.625,2730,43.6,48,2,1,0,1,204,0,0],[13,1.75,2625,37.2,14,1,1,0,1,132,0,0],[7,1.75,2625,36.4,13,1,1,0,1,156,0,0],[9,1.75,2625,39.8,15,1,1,0,1,120,0,0],[14,1.75,2437,33.6,11,1,1,0,1,120,0,0],[22,1.75,2437,41.5,14,1,1,0,1,120,0,0],[14,1.75,2340,41.2,27,2,0,1,1,162,0,0],[20,1.75,2340,36.5,24,2,1,0,1,120,0,0],[10,1.75,2070,23,6,1,1,0,1,84,0,0],[11,1.75,2500,47.7,17,1,1,0,1,120,0,0],[8,1.75,2253,26.6,8,1,1,0,1,108,0,0],[10,1.75,2187,25.9,8,1,1,0,1,96,0,0],[34,3.75,3310,41.1,78,2,0,1,2,105,0,0],[29,3.75,3310,41.7,79,2,0,1,2,93,0,0],[13,1.75,2253,34,11,1,1,0,1,84,0,0],[7,1.75,2253,26.6,8,1,1,0,1,108,0,0],[16,1.75,2340,29.1,9,1,1,0,1,108,0,0],[21,1.75,2500,48.6,17,1,1,0,1,120,0,0],[6,1.75,2500,39.9,14,1,1,0,1,120,0,0],[30,1.75,2187,35,21,2,1,0,1,132,0,0],[13,1.75,2187,34.1,21,2,1,0,1,132,0,0],[12,1.75,2187,30.2,18,2,1,0,1,156,0,0],[11,1.75,2187,30.8,19,2,1,0,1,132,0,0],[8,1.75,2625,38.9,14,1,1,0,1,120,0,0],[39,2.625,2500,39.5,40,2,1,0,1,138,0,0],[10,1.75,2625,36.4,13,1,1,0,1,132,0,0],[6,1.75,2625,44.6,16,1,1,0,1,120,0,0],[15,1.75,2625,40.3,15,1,1,0,1,132,0,0],[9,1.75,2437,31.7,11,1,1,0,1,120,0,0],[17,3.75,2950,59.7,48,1,1,0,1,132,0,0],[41,2.625,2625,35.1,37,2,0,1,1,144,0,0],[37,3.75,3437,46.7,92,2,0,1,2,105,1,0],[16,1.75,2070,34.1,19,2,1,0,1,120,0,0],[9,1.75,2437,31.5,11,1,1,0,1,132,0,0],[25,2.625,2500,40.9,41,2,0,1,1,138,0,0],[9,1.75,2187,31.6,9,1,1,0,1,84,0,0],[29,3.75,3065,39.2,68,2,0,1,1,162,0,0],[32,3.75,3310,44.4,84,2,0,1,2,93,0,0],[9,1.75,2070,22.3,6,1,1,0,1,84,0,0],[22,2.625,2500,48.2,48,2,1,0,1,156,0,0],[32,1.75,2187,19.6,12,2,1,0,1,156,0,0],[12,1.75,2340,28.8,9,1,1,0,1,120,0,0],[6,1.75,2340,29.8,10,1,1,0,1,156,0,0],[18,1.75,2340,34.9,23,2,1,0,1,156,0,0],[13,1.75,2253,26.6,8,1,1,0,1,108,0,0],[8,1.75,2253,27.3,8,1,1,0,1,132,0,0],[5,1.75,2070,23,6,1,1,0,1,84,0,0],[15,1.75,2070,23,7,1,1,0,1,84,0,0],[10,1.75,2730,48.2,19,1,0,1,1,162,0,0],[36,1.75,2253,36.6,23,2,1,0,1,132,0,0],[6,1.75,2625,37.6,14,1,1,0,1,132,0,0],[10,1.75,2625,39.4,15,1,1,0,1,132,0,0],[9,1.75,2340,28.1,9,1,1,0,1,120,0,0],[19,1.75,2187,30.5,18,2,1,0,1,132,0,0],[28,1.75,2187,31,19,2,1,0,1,132,0,0],[12,1.75,2625,47.5,18,1,1,0,1,132,0,0],[14,1.75,2187,25.9,8,1,1,0,1,96,0,0],[31,3.75,3125,33.6,60,2,0,1,2,93,0,0],[39,3.75,3625,58.2,121,2,0,1,2,105,1,0],[26,1.75,2187,31.6,19,2,1,0,1,132,0,0],[8,1.75,2437,30.8,10,1,1,0,1,132,0,0],[8,1.75,2253,28.2,9,1,1,0,1,108,0,0],[9,1.75,2437,35.2,12,1,1,0,1,108,0,0],[9,1.75,2625,43.6,16,1,1,0,1,120,0,0],[24,2.625,2730,44.2,24,1,0,1,1,126,0,0],[45,2.625,2950,46.8,56,2,0,1,1,162,0,0],[9,1.75,2070,23,6,1,1,0,1,84,0,0],[30,3.75,3065,41.2,71,2,1,0,1,192,0,0],[13,1.75,2070,31.2,9,1,1,0,1,72,0,0],[24,1.75,2253,35.4,22,2,1,0,1,132,0,0],[15,1.75,2340,28.7,9,1,1,0,1,120,0,0],[14,1.75,2340,31.3,20,2,1,0,1,180,0,0],[45,2.625,2500,41.7,42,2,0,1,1,138,0,0],[32,1.75,2340,47.3,31,2,0,1,1,138,0,0],[22,1.75,2730,47.1,18,1,1,0,1,120,0,0],[72,3.75,2830,51.4,82,2,0,1,1,162,0,0],[21,2.625,2500,38.9,39,2,0,1,1,162,0,0],[20,1.75,2625,47.9,35,2,0,1,2,93,0,0],[8,1.75,2625,40.6,15,1,1,0,1,120,0,0],[13,1.75,2437,33.3,23,2,1,0,1,204,0,0],[15,1.75,2070,29.4,8,1,1,0,1,60,0,0],[13,1.75,2437,31.7,11,1,1,0,1,120,0,0],[6,1.75,2437,50.6,13,1,1,0,1,108,0,0],[10,1.75,2625,44.6,16,1,1,0,1,120,0,0],[9,1.75,2340,28.5,9,1,1,0,1,108,0,0],[10,2.625,2730,39.3,22,1,1,0,1,108,0,0],[10,2.625,2730,38.7,21,1,1,0,1,120,0,0],[14,1.75,2070,28.5,16,2,1,0,1,120,0,0],[17,1.75,2253,36.1,22,2,1,0,1,132,0,0],[17,2.625,2830,31.7,36,2,1,0,1,132,0,0],[18,2.625,2500,57,57,2,0,1,1,162,0,0],[7,1.75,2437,32.1,11,1,1,0,1,108,0,0],[6,1.75,2437,32.7,11,1,1,0,1,108,0,0],[8,1.75,2253,26,8,1,1,0,1,108,0,0],[16,1.75,2340,36.4,24,2,0,1,1,162,0,0],[14,1.75,2187,25.5,15,2,1,0,1,156,0,0],[12,1.75,2625,44,16,1,1,0,1,132,0,0],[16,1.75,2187,31.6,19,2,1,0,1,132,0,0],[30,1.75,2437,43.8,30,2,1,0,1,132,0,0],[6,1.75,2625,40.6,15,1,1,0,1,120,0,0],[10,1.75,2500,33.7,12,1,1,0,1,132,0,0],[17,2.625,2500,34,34,2,0,1,1,138,0,0],[14,1.75,2187,35.4,21,2,1,0,1,132,0,0],[19,1.75,2625,45.3,33,2,1,0,1,204,0,0],[18,1.75,2500,38.7,13,1,1,0,1,120,0,0],[50,1.75,2070,27.9,8,1,1,0,1,60,0,0],[22,1.75,2253,43.9,27,2,0,1,1,162,0,0],[8,1.75,2340,30.2,10,1,1,0,1,108,0,0],[36,1.75,2340,42.3,27,2,0,1,1,162,0,0],[17,2.625,2500,42.4,43,2,0,1,1,138,0,0],[36,2.625,2830,37.5,43,2,0,1,1,162,0,0],[14,1.75,2187,34.3,21,2,1,0,1,132,0,0],[40,1.75,2187,32.8,20,2,1,0,1,132,0,0],[30,1.75,2187,32.8,20,2,1,0,1,132,0,0],[15,1.75,2253,26,8,1,1,0,1,108,0,0],[9,1.75,2437,33.9,11,1,1,0,1,120,0,0],[10,1.75,2340,29.9,10,1,1,0,1,120,0,0],[14,1.75,2340,31.3,20,2,1,0,1,180,0,0],[12,1.75,2340,41.1,27,2,1,0,1,132,0,0],[17,3.75,2830,47.1,38,1,1,0,1,132,0,0],[27,2.625,2950,48.7,59,2,0,1,1,162,0,0],[8,1.75,2253,26,8,1,1,0,1,108,0,0],[17,2.625,2500,32.8,33,2,0,1,1,114,0,0],[16,1.75,2070,23.7,7,1,1,0,1,84,0,0],[18,1.75,2437,31.7,11,1,1,0,1,120,0,0],[23,1.75,2070,27.3,8,1,1,0,1,72,0,0],[26,1.75,2187,27.1,8,1,1,0,1,84,0,0],[8,1.75,2500,36.8,13,1,1,0,1,132,0,0],[28,3.75,3437,45.9,90,2,0,2,1,105,1,0],[60,2.625,2830,37.5,43,2,0,1,1,162,0,0],[25,3.75,3065,36.3,63,2,0,1,1,162,0,0],[11,1.75,2253,25.1,8,1,1,0,1,108,0,0],[5,1.75,2253,26,8,1,1,0,1,108,0,0],[11,1.75,2253,26.6,17,2,1,0,1,180,0,0],[9,1.75,2253,26.9,17,2,1,0,1,156,0,0],[27,1.75,2187,31.5,19,2,1,0,1,132,0,0],[22,1.75,2437,41,14,1,1,0,1,120,0,0],[19,1.75,2625,40.3,15,1,1,0,1,132,0,0],[6,1.75,2625,44.6,16,1,1,0,1,108,0,0],[18,1.75,2500,46.6,13,2,0,1,1,162,0,0],[7,1.75,2253,27.9,9,1,1,0,1,132,0,0],[10,1.75,2437,38,13,1,1,0,1,120,0,0],[15,1.75,2340,33.1,11,1,1,0,1,132,0,0],[22,1.75,2340,48,31,2,0,1,1,162,0,0],[11,1.75,2340,42.6,28,2,0,1,1,138,0,0],[19,2.625,2625,37,20,1,1,0,1,132,0,0],[7,1.75,2340,29.8,10,1,1,0,1,108,0,0],[13,1.75,2730,40.3,16,1,0,1,1,114,0,0],[11,1.75,2437,45.8,16,1,1,0,1,132,0,0],[9,1.75,2625,40.3,15,1,1,0,1,132,0,0],[9,2.625,2625,31.3,17,1,1,0,1,132,0,0],[12,1.75,2070,25.6,14,2,1,0,1,132,0,0],[22,2.625,2625,42.7,45,2,0,1,1,162,0,0],[16,2.625,2625,28.7,15,1,1,0,1,132,0,0],[13,1.75,2187,28.6,17,2,1,0,1,156,0,0],[15,1.75,2253,36.8,23,2,1,0,1,132,0,0],[114,6,4375,52.9,416,4,0,2,1,165,1,0],[126,6,3938,41.9,295,4,0,2,1,129,1,0],[19,1.75,2625,42,31,2,0,1,1,162,0,0],[21,2.625,2500,36.1,36,2,0,1,1,162,0,0],[10,1.75,2437,31.7,11,1,1,0,1,120,0,0],[12,2.625,2500,40,20,1,1,0,1,120,0,0],[9,1.75,2070,24.5,7,1,1,0,1,72,0,0],[13,1.75,2070,31.7,18,2,1,0,1,132,0,0],[15,1.75,2187,33.8,20,2,1,0,1,132,0,0],[11,1.75,2437,37.1,13,1,1,0,1,108,0,0],[7,2.625,2625,32.3,17,1,1,0,1,132,0,0],[12,2.625,2625,34.9,18,1,1,0,1,132,0,0],[14,1.75,2500,47.7,17,1,1,0,1,120,0,0],[7,1.75,2500,37.9,13,1,1,0,1,120,0,0],[13,1.75,2500,38.5,27,2,1,0,1,204,0,0],[17,1.75,2437,39,26,2,0,1,1,105,0,0],[44,6,3938,43.2,152,2,0,1,1,129,1,0],[30,1.75,2730,45.4,18,1,3,0,1,156,0,0],[9,2.625,2625,30,16,1,1,0,1,120,0,0],[14,1.75,2187,29.9,18,2,1,0,1,132,0,0],[7,1.75,2437,31.5,11,1,1,0,1,132,0,0],[10,1.75,2625,39.9,15,1,1,0,1,120,0,0],[15,2.625,2625,37.6,40,2,0,1,1,175,0,0],[14,1.75,2253,34.7,22,2,1,0,1,132,0,0],[26,3.75,3437,48.1,94,2,0,1,1,105,1,0],[54,5.25,4062,57.2,183,2,0,1,1,87,1,0],[9,1.75,2070,29,8,1,1,0,1,84,0,0],[9,1.75,2070,33.1,9,1,1,0,1,72,0,0],[7,1.75,2187,26.2,8,1,1,0,1,120,0,0],[6,1.75,2253,26.2,8,1,1,0,1,108,0,0],[14,1.75,2437,38.8,26,2,0,1,1,105,0,0],[15,2.626,2500,43.1,22,1,1,0,0,108,0,0],[30,2.625,2500,46.1,46,2,2,0,1,132,0,0],[14,1.75,2187,31.3,19,2,1,0,1,132,0,0],[14,1.75,2253,34.7,22,2,1,0,1,132,0,0],[13,1.75,2340,34.1,22,2,1,0,1,156,0,0],[12,1.75,2437,30.8,10,1,1,0,1,132,0,0],[6,2.625,2625,29.1,15,1,1,0,1,132,0,0],[11,2.625,2625,28.9,15,1,1,0,1,120,0,0],[6,2.625,2625,30.7,16,1,1,0,1,120,0,0],[5,2.625,2625,31.7,17,1,1,0,1,108,0,0],[26,3.75,3437,43.3,85,2,0,1,1,105,1,0],[25,1.75,2070,45,25,2,1,0,1,132,0,0],[13,1.75,2340,28.1,9,1,1,0,1,120,0,0],[28,2.625,2625,55.7,29,1,1,0,1,120,0,0]];

// Rails cols: [Temps, Hauteur_in, Clip, FullAngle, Rayon,
//              Residentielle, ComLeger, ComRobust, Industrielle,
//              HiLift, FullVert, PenteToit, LowHeadRoom, HautHighLift]
const RAILS_DATA = [[90,96,1,0,12,1,0,0,0,1,0,0,0,36],[90,108,1,0,12,0,1,0,0,1,0,0,0,24],[75,84,1,0,0,0,0,1,0,0,1,0,0,0],[75,120,1,0,15,0,1,0,0,0,0,0,0,0],[180,120,1,0,12,0,2,0,0,1,0,0,0,36],[60,168,1,0,15,0,0,0,1,0,0,0,0,0],[180,168,1,0,15,0,0,0,2,0,0,0,0,0],[75,108,1,0,15,0,0,1,0,0,0,0,0,0],[150,108,0,1,12,0,0,0,1,1,0,0,0,24],[90,108,1,0,0,0,1,0,0,0,0,0,1,0],[75,132,1,0,12,0,0,1,0,0,0,0,0,0],[165,108,1,0,12,0,2,0,0,1,0,0,0,60],[80,108,1,0,12,0,1,0,0,1,0,0,0,66],[90,84,1,0,0,0,1,0,0,0,1,0,0,0],[60,108,1,0,12,0,0,1,0,0,0,0,0,0],[270,120,1,0,12,0,3,0,0,1,0,0,0,22],[90,84,1,0,12,0,1,0,0,1,0,0,0,23],[90,96,1,0,12,0,1,0,0,1,0,0,0,58],[60,120,1,0,10,1,0,0,0,0,0,0,0,0],[60,144,1,0,12,0,0,1,0,0,0,0,0,0],[45,144,1,0,12,0,0,1,0,0,0,1,0,0],[180,192,1,0,12,0,0,1,0,0,0,1,0,0],[150,360,0,1,15,0,0,0,1,0,0,0,0,0],[45,120,1,0,15,0,1,0,0,0,0,0,0,0],[45,120,1,0,12,0,1,0,0,0,0,0,0,0],[75,144,1,0,12,0,0,1,0,0,0,0,0,0],[100,96,1,0,12,1,0,0,0,1,0,0,0,36],[90,96,1,0,12,1,0,0,0,1,0,0,0,23],[30,84,1,0,0,1,0,0,0,0,0,0,1,0],[20,96,1,0,10,1,0,0,0,0,0,0,0,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[30,81,1,0,10,1,0,0,0,0,0,0,0,0],[20,72,1,0,10,1,0,0,0,0,0,0,0,0],[75,144,1,0,15,0,0,0,1,0,0,0,0,0],[90,156,1,0,15,0,0,0,1,0,0,0,0,0],[150,144,0,1,12,0,0,1,0,1,0,0,0,19],[90,84,1,0,12,1,0,0,0,1,0,0,0,32],[120,93,0,1,0,0,1,0,0,0,1,0,0,0],[120,84,1,0,12,1,0,0,0,1,0,0,0,28],[80,120,1,0,15,0,0,1,0,0,0,0,0,0],[80,120,1,0,15,0,1,0,0,0,0,0,0,0],[120,159,1,0,15,0,0,1,0,0,0,0,0,0],[120,84,1,0,12,1,0,0,0,1,0,0,0,24],[120,144,1,0,15,0,0,1,0,0,0,0,0,0],[90,96,1,0,12,1,0,0,0,1,0,0,0,12],[120,120,1,0,15,0,1,0,0,0,0,0,0,0],[60,120,1,0,12,0,1,0,0,0,0,0,0,0],[100,84,1,0,12,1,0,0,0,1,0,0,0,28],[240,120,0,1,0,0,0,0,1,0,1,0,0,0],[150,120,1,0,15,0,1,0,0,0,0,1,0,0],[180,84,1,0,12,1,0,0,0,1,0,0,0,36],[105,168,0,1,15,0,0,0,1,0,0,0,0,0],[90,84,1,0,12,1,0,0,0,1,0,0,0,22],[90,84,1,0,12,1,0,0,0,1,0,0,0,22],[105,144,1,0,15,0,0,1,0,0,0,0,0,0],[90,144,1,0,15,0,0,0,1,0,0,0,0,0],[120,84,1,0,12,1,0,0,0,0,0,1,0,0],[60,108,1,0,12,0,0,1,0,0,0,0,0,0],[150,120,1,0,15,0,0,2,0,0,0,0,0,0],[30,84,1,0,15,1,0,0,0,0,0,0,0,0],[105,108,1,0,10,2,0,0,0,0,0,0,0,0],[120,120,1,0,12,0,2,0,0,0,0,0,0,0],[90,168,1,0,15,0,0,0,1,0,0,0,0,0],[90,84,1,0,10,6,0,0,0,0,0,0,0,0],[30,84,1,0,10,1,0,0,0,0,0,0,0,0],[30,84,1,0,10,1,0,0,0,0,0,0,0,0],[45,84,1,0,10,2,0,0,0,0,0,0,0,0],[105,105,1,0,12,0,2,0,0,0,0,0,0,0],[60,144,1,0,15,0,0,1,0,0,0,0,0,0],[60,144,1,0,12,0,0,1,0,0,0,0,0,0],[45,144,1,0,12,0,1,0,0,0,0,0,0,0],[90,108,1,0,12,0,2,0,0,0,0,0,0,0],[90,144,1,0,15,0,0,0,1,0,0,0,0,0],[90,159,1,0,15,0,0,0,1,0,0,0,0,0],[180,168,1,0,15,0,0,0,2,0,0,0,0,0],[180,96,1,0,12,2,0,0,0,1,0,0,0,36],[90,96,1,0,12,1,0,0,0,1,0,0,0,38],[90,96,1,0,12,1,0,0,0,1,0,0,0,38],[105,120,1,0,10,2,0,0,0,0,0,0,0,0],[60,120,1,0,10,1,0,0,0,0,0,0,0,0],[60,120,1,0,10,1,0,0,0,0,0,0,0,0],[120,168,0,1,15,0,0,1,0,0,0,0,0,0],[105,120,1,0,10,2,0,0,0,0,0,0,0,0],[60,144,1,0,15,0,0,1,0,0,0,0,0,0],[210,144,1,0,12,0,0,2,0,1,0,0,0,49],[150,111,1,0,12,0,0,1,0,0,0,1,0,0],[90,81,1,0,12,0,1,0,0,0,0,0,0,0],[60,114,1,0,12,0,1,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[25,84,1,0,10,1,0,0,0,0,0,0,0,0],[25,96,1,0,15,1,0,0,0,0,0,0,0,0],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[25,72,1,0,10,1,0,0,0,0,0,0,0,0],[30,84,1,0,12,1,0,0,0,0,0,0,0,0],[40,75,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[30,96,1,0,12,1,0,0,0,0,0,0,0,0],[40,84,1,0,0,1,0,0,0,0,0,0,1,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[30,168,1,0,15,0,0,1,0,0,0,0,0,0],[60,120,1,0,15,0,1,0,0,0,0,0,0,0],[60,132,1,0,15,0,0,1,0,0,0,0,0,0],[90,84,1,0,12,1,0,0,0,1,0,0,0,24],[75,108,1,0,10,1,0,0,0,0,0,0,0,1],[180,96,1,0,12,0,0,1,0,1,0,0,0,27],[15,87,1,0,10,1,0,0,0,0,0,0,0,0],[30,96,1,0,10,1,0,0,0,0,0,0,0,0],[105,144,0,1,12,0,0,1,0,1,0,0,0,37],[60,108,1,0,15,0,1,0,0,0,0,0,0,0],[150,144,1,0,15,0,0,0,2,0,0,0,0,0],[60,84,1,0,15,0,0,0,1,0,0,0,0,0],[90,96,1,0,12,0,0,1,0,0,0,1,0,0],[120,144,1,0,15,0,0,0,2,0,0,0,0,0],[15,84,1,0,15,1,0,0,0,0,0,0,0,0],[90,84,1,0,12,6,0,0,0,0,0,0,0,0],[130,168,0,1,15,0,0,0,1,0,0,0,0,0],[120,168,1,0,15,0,0,0,1,0,0,0,0,0],[210,144,1,0,15,0,0,0,3,0,0,0,0,0],[20,120,1,0,15,0,1,0,0,0,0,0,0,0],[140,96,1,0,12,1,0,0,0,1,0,0,0,0],[70,120,1,0,15,0,1,0,0,0,0,0,0,0],[70,120,1,0,15,0,0,1,0,0,0,0,0,0],[40,144,1,0,15,0,0,1,0,0,0,0,0,0],[180,108,1,0,12,0,2,0,0,1,0,0,0,15],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[20,72,1,0,10,1,0,0,0,0,0,0,0,0],[40,96,1,0,12,2,0,0,0,0,0,0,0,0],[40,96,1,0,15,2,0,0,0,0,0,0,0,0],[15,84,1,0,10,1,0,0,0,0,0,0,0,0],[15,78,1,0,10,1,0,0,0,0,0,0,0,0],[15,78,1,0,10,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[120,96,1,0,12,0,0,0,1,1,0,0,0,18],[60,168,1,0,15,0,0,0,1,0,0,0,0,0],[60,141,1,0,12,0,0,1,0,0,0,0,0,0],[90,84,1,0,12,1,0,0,0,1,0,0,0,36],[240,216,1,0,12,0,0,0,2,1,0,0,0,53],[180,216,1,0,12,0,0,0,1,1,0,0,0,53],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[30,84,1,0,10,1,0,0,0,0,0,0,0,0],[20,96,1,0,10,1,0,0,0,0,0,0,0,0],[30,84,1,0,0,1,0,0,0,0,0,0,1,0],[120,120,1,0,12,0,0,0,1,1,0,0,0,12],[20,96,1,0,15,1,0,0,0,0,0,0,0,0],[20,96,1,0,10,1,0,0,0,0,0,0,0,0],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,96,1,0,12,2,0,0,0,0,0,0,0,0],[105,84,1,0,12,1,0,0,0,0,0,1,0,0],[15,84,1,0,10,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[15,84,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[15,81,1,0,10,1,0,0,0,0,0,0,0,0],[15,96,1,0,10,1,0,0,0,0,0,0,0,0],[15,96,1,0,10,1,0,0,0,0,0,0,0,0],[40,96,1,0,15,1,0,0,0,0,0,0,0,0],[150,168,0,1,15,0,0,0,1,0,0,0,0,0],[90,108,1,0,15,0,0,1,0,0,0,1,0,0],[90,84,1,0,12,1,0,0,0,0,0,1,0,0],[510,57,1,0,12,3,0,0,0,1,0,0,0,12],[120,108,1,0,15,0,2,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[40,84,1,0,10,2,0,0,0,0,0,0,0,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[20,96,1,0,10,1,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[90,96,1,0,12,1,0,0,0,1,0,0,0,9],[20,96,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[40,84,1,0,12,1,0,0,0,0,0,0,0,0],[30,81,1,0,10,1,0,0,0,0,0,0,0,0],[60,84,1,0,0,2,0,0,0,0,0,0,1,0],[30,84,1,0,10,1,0,0,0,0,0,0,0,0],[30,84,1,0,10,1,0,0,0,0,0,0,0,0],[30,84,1,0,10,1,0,0,0,0,0,0,0,0],[60,141,1,0,12,0,0,1,0,0,0,0,0,0],[30,84,1,0,15,1,0,0,0,0,0,0,0,0],[95,84,1,0,0,0,1,0,0,0,1,0,0,0],[60,108,1,0,15,0,0,0,1,0,0,0,0,0],[300,108,1,0,12,0,0,0,2,1,0,0,0,23],[120,93,1,0,12,2,0,0,0,0,0,1,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,0],[40,84,1,0,12,2,0,0,0,0,0,0,0,0],[20,84,1,0,12,1,0,0,0,0,0,0,0,1],[90,102,1,0,12,0,0,1,0,1,0,0,0,15],[90,168,1,0,15,0,0,0,1,0,0,0,0,0],[45,132,1,0,15,0,0,0,1,0,0,0,0,0],[45,132,1,0,15,0,0,0,1,0,0,0,0,0],[20,84,1,0,10,1,0,0,0,0,0,0,0,0],[40,93,1,0,10,2,0,0,0,0,0,0,0,0],[180,144,1,0,15,0,0,0,2,0,0,0,0,0],[25,96,1,0,12,1,0,0,0,0,0,0,0,0],[25,84,1,0,12,1,0,0,0,0,0,0,0,0],[25,96,1,0,12,1,0,0,0,0,0,0,0,0],[50,84,1,0,12,2,0,0,0,0,0,0,0,0],[25,96,1,0,12,1,0,0,0,0,0,0,0,0],[25,84,1,0,12,1,0,0,0,0,0,0,0,0],[30,75,1,0,0,1,0,0,0,0,0,0,1,0],[75,141,1,0,12,0,0,1,0,0,0,0,0,0],[45,96,1,0,10,2,0,0,0,0,0,0,0,0],[20,87,1,0,12,1,0,0,0,0,0,0,0,0],[240,96,1,0,12,2,0,0,0,1,0,0,0,43],[90,168,1,0,15,0,0,0,1,0,0,0,0,0],[180,108,1,0,0,0,0,0,2,0,1,0,0,0],[60,108,1,0,15,0,0,1,0,0,0,0,0,0]];

// ==============================================================================
// CONFIG PAR MODE (features, colonnes, libellés)
// ==============================================================================
const TORSION_CONFIG = {
  label: 'Torsion',
  columns: ['Temps','Diametre','Maille','Long','Poids','NbRessorts','Tubing','Plein','NbShaft','LongShaft','PillowBlock','Duplex'],
  defaults: { Diametre: 1.75, Maille: 2437, Long: 35, Poids: 15, NbRessorts: 1, Tubing: 1, Plein: 0, NbShaft: 1, LongShaft: 120, PillowBlock: 0, Duplex: 0 },
  featureFn: (r) => [
    r.Poids * r.NbRessorts,
    r.Long,
    r.Diametre,
    r.Maille,
    r.NbRessorts,
    r.LongShaft,
    r.Tubing,
    r.Plein,
    r.PillowBlock,
    Math.log1p(r.Poids),
    r.NbShaft,
    r.Duplex,  // will be auto-dropped by trainer if zero-variance
  ],
  featureLabels: [
    'Poids × nb ressorts', 'Longueur ressort', 'Diamètre', 'Maille',
    'Nb ressorts', 'Longueur shaft', 'Shafts tubing', 'Shafts pleins',
    'Pillow block', 'log(Poids)', 'Nb shafts', 'Duplex',
  ],
  logTarget: true,
  ocrFields: {
    Diametre:    { labels: ['diamètre','diametre','diameter','diam'], type: 'enum', values: [1.75, 2.625, 3.75, 5.25, 6.0] },
    Maille:      { labels: ['maille','mesh'], type: 'int' },
    Long:        { labels: ['longueur','long'], type: 'float' },
    Poids:       { labels: ['poids','weight'], type: 'float' },
    NbRessorts:  { labels: ['nb.ressorts','nb ressorts','nombre ressorts','# ressorts','ressorts'], type: 'int' },
    NbShaft:     { labels: ['nb.shaft','nb shaft','nombre shaft','# shaft'], type: 'int' },
    LongShaft:   { labels: ['long shaft','longueur shaft','long. shaft'], type: 'float' },
    Tubing:      { labels: ['tubing'], type: 'int' },
    Plein:       { labels: ['plein','solid'], type: 'int' },
    PillowBlock: { labels: ['pillow block','pillow'], type: 'bool' },
    Duplex:      { labels: ['duplex'], type: 'bool' },
  },
};

const RAILS_CONFIG = {
  label: 'Rails',
  columns: ['Temps','Hauteur_in','Clip','FullAngle','Rayon','Residentielle','ComLeger','ComRobust','Industrielle','HiLift','FullVert','PenteToit','LowHeadRoom','HautHighLift'],
  defaults: { Hauteur_in: 96, Clip: 1, FullAngle: 0, Rayon: 12, Residentielle: 1, ComLeger: 0, ComRobust: 0, Industrielle: 0, HiLift: 0, FullVert: 0, PenteToit: 0, LowHeadRoom: 0, Standard: 1, HautHighLift: 0 },
  featureFn: (r) => [
    r.Hauteur_in,
    r.Clip,
    r.FullAngle,
    r.Rayon,
    (r.Residentielle||0) + (r.ComLeger||0) + (r.ComRobust||0) + (r.Industrielle||0), // NombreDoors
    r.Residentielle || 0,
    r.ComLeger || 0,
    r.ComRobust || 0,
    r.Industrielle || 0,
    r.HiLift || 0,
    r.FullVert || 0,
    r.PenteToit || 0,
    r.LowHeadRoom || 0,
    r.HautHighLift || 0,
  ],
  featureLabels: [
    'Hauteur porte', 'Clip', 'Full angle', 'Rayon', 'Nb portes',
    'Résidentielle', 'Com. léger', 'Com. robuste', 'Industrielle',
    'Hi-lift', 'Full vert.', 'Pente toit', 'Low head room', 'Haut. high-lift',
  ],
  logTarget: false,  // linear target works better for rails
  ocrFields: {
    Hauteur_in:  { labels: ['hauteur porte','hauteur','height'], type: 'feet-inches' },
    Rayon:       { labels: ['rayon','radius'], type: 'int' },
    // Booleans inferred from checkbox marks are harder; user confirms manually.
  },
};

// ==============================================================================
// ALGÈBRE LINÉAIRE
// ==============================================================================
function transpose(A) { return A[0].map((_, j) => A.map(r => r[j])); }
function matmul(A, B) {
  const m = A.length, n = B[0].length, k = B.length;
  const C = Array.from({length: m}, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) for (let l = 0; l < k; l++) {
    const a = A[i][l]; for (let j = 0; j < n; j++) C[i][j] += a * B[l][j];
  }
  return C;
}
function solveLinear(A, b) {
  const n = A.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let i = 0; i < n; i++) {
    let piv = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k;
    [M[i], M[piv]] = [M[piv], M[i]];
    const d = M[i][i];
    if (Math.abs(d) < 1e-12) throw new Error('Matrice singulière');
    for (let j = i; j <= n; j++) M[i][j] /= d;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const f = M[k][i]; if (f === 0) continue;
      for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j];
    }
  }
  return M.map(r => r[n]);
}

// ==============================================================================
// ENTRAÎNEMENT — Ridge avec drop auto des features zéro-variance
// ==============================================================================
function trainRidge(data, config, alpha = 1.0) {
  const X_full = data.map(config.featureFn);
  const y = data.map(r => config.logTarget ? Math.log1p(r.Temps) : r.Temps);
  const n = X_full.length, p_full = X_full[0].length;

  // Detect zero-variance columns; drop them (model can't learn)
  const variances = new Array(p_full).fill(0);
  const means_full = new Array(p_full).fill(0);
  for (let j = 0; j < p_full; j++) {
    for (let i = 0; i < n; i++) means_full[j] += X_full[i][j];
    means_full[j] /= n;
    for (let i = 0; i < n; i++) variances[j] += (X_full[i][j] - means_full[j]) ** 2;
  }
  const keptIdx = [];
  for (let j = 0; j < p_full; j++) if (variances[j] > 1e-10) keptIdx.push(j);
  const X = X_full.map(r => keptIdx.map(j => r[j]));
  const p = X[0].length;

  // Standardisation
  const mean = new Array(p).fill(0), std = new Array(p).fill(0);
  for (let j = 0; j < p; j++) {
    for (let i = 0; i < n; i++) mean[j] += X[i][j];
    mean[j] /= n;
    for (let i = 0; i < n; i++) std[j] += (X[i][j] - mean[j]) ** 2;
    std[j] = Math.sqrt(std[j] / n) || 1;
  }
  const Xs = X.map(r => r.map((v, j) => (v - mean[j]) / std[j]));
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  const yC = y.map(v => v - yMean);

  // Normal equations (XᵀX + αI)β = Xᵀy
  const Xt = transpose(Xs);
  const XtX = matmul(Xt, Xs);
  for (let i = 0; i < p; i++) XtX[i][i] += alpha;
  const Xty = matmul(Xt, yC.map(v => [v])).map(r => r[0]);
  const beta = solveLinear(XtX, Xty);

  // Predictions and residuals
  const preds_raw = Xs.map(x => x.reduce((s, v, j) => s + v * beta[j], yMean));
  const residuals = y.map((v, i) => v - preds_raw[i]);
  const sorted = [...residuals].sort((a, b) => a - b);
  const q = p => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(sorted.length * p)))];

  // MAE on original scale
  const maeOrig = preds_raw.reduce((s, pv, i) => {
    const pred = config.logTarget ? Math.exp(pv) - 1 : pv;
    const act  = config.logTarget ? Math.exp(y[i]) - 1 : y[i];
    return s + Math.abs(pred - act);
  }, 0) / n;

  // Feature ranges on full feature space (for extrapolation check)
  const featureRanges = X_full[0].map((_, j) => {
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i < n; i++) {
      if (X_full[i][j] < mn) mn = X_full[i][j];
      if (X_full[i][j] > mx) mx = X_full[i][j];
    }
    return { min: mn, max: mx, dropped: !keptIdx.includes(j) };
  });

  // Importance: put 0 for dropped features, |standardized coef| normalized for others
  const absCoefs = beta.map(Math.abs);
  const sumAbs = absCoefs.reduce((a, b) => a + b, 0) || 1;
  const importance = new Array(p_full).fill(0);
  keptIdx.forEach((j, i) => importance[j] = absCoefs[i] / sumAbs);

  // Full-sized coefficients (0 for dropped)
  const fullBeta = new Array(p_full).fill(0);
  keptIdx.forEach((j, i) => fullBeta[j] = beta[i]);

  return {
    keptIdx, beta, mean, std, yMean,
    q05: q(0.05), q10: q(0.10), q90: q(0.90), q95: q(0.95),
    resStd: Math.sqrt(residuals.reduce((s,v)=>s+v*v,0)/n),
    n, p, maeOrig, featureRanges, importance, fullBeta,
    logTarget: config.logTarget,
    alpha,
  };
}

function predict(model, inputs, config, duplexFactor = 1.0) {
  const fFull = config.featureFn(inputs);
  const f = model.keptIdx.map(j => fFull[j]);
  const xs = f.map((v, j) => (v - model.mean[j]) / model.std[j]);
  const raw = xs.reduce((s, v, j) => s + v * model.beta[j], model.yMean);
  let center, lo, hi;
  if (model.logTarget) {
    center = Math.max(0.5, Math.exp(raw) - 1);
    lo = Math.max(0.5, Math.exp(raw + model.q10) - 1);
    hi = Math.max(0.5, Math.exp(raw + model.q90) - 1);
  } else {
    center = Math.max(0.5, raw);
    lo = Math.max(0.5, raw + model.q10);
    hi = Math.max(0.5, raw + model.q90);
  }

  // Apply Duplex heuristic multiplier if duplex is 1 and feature was dropped
  const duplexIdx = config.columns.indexOf('Duplex') - 1; // -1 because Temps is at 0
  if (duplexIdx >= 0 && inputs.Duplex === 1 && model.featureRanges[11] && model.featureRanges[11].dropped) {
    center *= duplexFactor;
    lo *= duplexFactor;
    hi *= duplexFactor;
  }

  // Contributions
  const contributions = xs.map((v, j) => v * model.beta[j]);
  const fullContribs = new Array(fFull.length).fill(0);
  model.keptIdx.forEach((j, i) => fullContribs[j] = contributions[i]);

  // Out-of-domain check (only on kept features)
  const outOfDomain = [];
  model.keptIdx.forEach((j, i) => {
    const { min, max } = model.featureRanges[j];
    if (fFull[j] < min || fFull[j] > max) outOfDomain.push(config.featureLabels[j]);
  });

  return { center, lo, hi, contributions: fullContribs, outOfDomain, duplexApplied: inputs.Duplex === 1 && model.featureRanges[11] && model.featureRanges[11].dropped };
}

function findSimilar(data, inputs, config, k = 3) {
  const f = config.featureFn(inputs);
  const allF = data.map(config.featureFn);
  const ranges = f.map((_, j) => {
    let mn = Infinity, mx = -Infinity;
    allF.forEach(r => { if (r[j] < mn) mn = r[j]; if (r[j] > mx) mx = r[j]; });
    return (mx - mn) || 1;
  });
  const dists = data.map((r, i) => {
    let d = 0;
    for (let j = 0; j < f.length; j++) d += ((f[j] - allF[i][j]) / ranges[j]) ** 2;
    return { dist: Math.sqrt(d), record: r };
  });
  dists.sort((a, b) => a.dist - b.dist);
  return dists.slice(0, k);
}

// ==============================================================================
// CSV PARSER (mise à jour des données)
// ==============================================================================
function parseCSV(text, config) {
  const lines = text.trim().split(/\r?\n/);
  const rows = lines.map(l => l.split(/[,;\t]/).map(s => s.trim().replace(/^"|"$/g, '')));
  if (rows.length < 2) return null;
  const header = rows[0].map(s => s.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const findIdx = (names) => {
    for (const k of names) {
      const kN = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      for (let i = 0; i < header.length; i++) if (header[i].includes(kN)) return i;
    }
    return -1;
  };
  const map = {};
  for (const col of config.columns) {
    map[col] = findIdx([col, col.replace('_', ' ')]);
  }
  if (map.Temps === -1) return null;
  // For Rails, accept 'HauteurPorte' or similar
  if (config.label === 'Rails' && map.Hauteur_in === -1) {
    map.Hauteur_in = findIdx(['hauteurporte','hauteur','height']);
  }

  const parseFeetInches = (v) => {
    if (v == null || v === '') return NaN;
    if (!isNaN(parseFloat(v)) && !isNaN(v - 0)) {
      const n = parseFloat(v);
      return n > 40 ? n : n * 12;
    }
    const s = String(v).trim().replace(/[\u2032\u2019]/g, "'").replace(/[\u2033\u201D]/g, '"').replace(',', '.');
    const m = s.match(/^(\d+(?:\.\d+)?)'(\d+(?:\.\d+)?)?"?$/);
    if (m) return parseFloat(m[1]) * 12 + (m[2] ? parseFloat(m[2]) : 0);
    return NaN;
  };

  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    let ok = true;
    for (const col of config.columns) {
      const idx = map[col];
      if (idx === -1) { obj[col] = 0; continue; }
      const raw = rows[i][idx];
      let v;
      if (col === 'Hauteur_in') v = parseFeetInches(raw);
      else v = parseFloat(String(raw).replace(',', '.'));
      if (isNaN(v)) { ok = false; break; }
      obj[col] = v;
    }
    if (ok && obj.Temps > 0) out.push(obj);
  }
  return out.length >= 10 ? out : null;
}

function rowsToObjects(rows, columns) {
  return rows.map(r => {
    const o = {}; columns.forEach((c, i) => { o[c] = r[i]; }); return o;
  });
}

// ==============================================================================
// OCR — Tesseract.js chargé dynamiquement (uniquement quand l'utilisateur scan)
// ==============================================================================
let tesseractPromise = null;
function loadTesseract() {
  if (tesseractPromise) return tesseractPromise;
  tesseractPromise = new Promise((resolve, reject) => {
    if (window.Tesseract) return resolve(window.Tesseract);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js';
    s.onload = () => resolve(window.Tesseract);
    s.onerror = () => reject(new Error('Chargement de Tesseract échoué'));
    document.head.appendChild(s);
  });
  return tesseractPromise;
}

// ==============================================================================
// PRÉTRAITEMENT D'IMAGE pour améliorer drastiquement l'OCR mobile.
// Applique un seuillage adaptatif local (moyenne locale - seuil) pour compenser
// l'éclairage non uniforme des photos prises avec un téléphone.
// Cette approche transforme une photo moyennement éclairée en image presque
// parfaite pour Tesseract, récupérant ainsi les lignes de tableau entières
// et les sections shafts qui seraient autrement perdues.
// ==============================================================================
async function preprocessImage(file) {
  // 1. Charger l'image dans un canvas
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  // Limiter la taille pour accélérer le traitement (max 2000px sur grand côté)
  const maxDim = 2000;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const W = Math.round(img.width * scale);
  const H = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, W, H);
  URL.revokeObjectURL(img.src);

  const imageData = ctx.getImageData(0, 0, W, H);
  const pixels = imageData.data;

  // 2. Convertir en niveaux de gris (luminance)
  const gray = new Float32Array(W * H);
  for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
    gray[j] = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2];
  }

  // 3. Box blur séparable (moyenne locale) — simule un gaussien avec fenêtre 30px
  // Complexité O(n), utilise un tableau d'intégrale (prefix sum)
  const R = Math.round(Math.min(W, H) * 0.025); // rayon adaptatif ~2.5% de la plus petite dim
  const blurred = new Float32Array(W * H);

  // Passe horizontale
  const rowSum = new Float32Array(W + 1);
  for (let y = 0; y < H; y++) {
    rowSum[0] = 0;
    for (let x = 0; x < W; x++) rowSum[x+1] = rowSum[x] + gray[y*W + x];
    for (let x = 0; x < W; x++) {
      const a = Math.max(0, x - R);
      const b = Math.min(W, x + R + 1);
      blurred[y*W + x] = (rowSum[b] - rowSum[a]) / (b - a);
    }
  }
  // Passe verticale (remplit un tampon intermédiaire dans `gray` qu'on réutilise)
  const tmp = gray; // on réutilise gray comme buffer
  const colSum = new Float32Array(H + 1);
  for (let x = 0; x < W; x++) {
    colSum[0] = 0;
    for (let y = 0; y < H; y++) colSum[y+1] = colSum[y] + blurred[y*W + x];
    for (let y = 0; y < H; y++) {
      const a = Math.max(0, y - R);
      const b = Math.min(H, y + R + 1);
      tmp[y*W + x] = (colSum[b] - colSum[a]) / (b - a);
    }
  }
  // tmp contient maintenant le blur complet, blurred peut être réutilisé

  // 4. Seuillage adaptatif: pixel noir si pixel - blur < -seuil
  // On doit recalculer le gray original car on l'a écrasé dans tmp.
  // Solution: relire les pixels depuis imageData (toujours disponible)
  const SEUIL = 10;
  for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
    const lum = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2];
    const isInk = (lum - tmp[j]) < -SEUIL;
    const v = isInk ? 0 : 255;
    pixels[i] = v;
    pixels[i+1] = v;
    pixels[i+2] = v;
    pixels[i+3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  // 5. Retourner un blob PNG
  return new Promise((resolve) => {
    canvas.toBlob(b => resolve(b), 'image/png');
  });
}

async function runOCR(imageFile, onProgress) {
  // Prétraiter l'image AVANT d'envoyer à Tesseract — améliore dramatiquement
  // la qualité OCR sur photos de téléphone (seuillage adaptatif compense
  // les variations d'éclairage)
  let processed;
  try {
    processed = await preprocessImage(imageFile);
  } catch (e) {
    // Si le prétraitement échoue pour une raison ou une autre, on tombe sur l'image originale
    console.warn('Prétraitement échoué, utilisation de l\'image brute:', e);
    processed = imageFile;
  }

  const Tesseract = await loadTesseract();
  const { data } = await Tesseract.recognize(processed, 'fra+eng', {
    logger: m => { if (m.status === 'recognizing text' && onProgress) onProgress(m.progress); },
  });
  return data.text;
}

// Extraction par mots-clés dans le texte OCR (pour les cas où le format exact
// n'est pas connu — on utilise ce parser pour Rails)
function extractFromOCRGeneric(text, config) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const extracted = {};
  const normalize = s => s.toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\w\sàâäéèêëîïôöùûüç.'"\-]/g, ' ')
    .replace(/\s+/g, ' ');

  for (const [field, spec] of Object.entries(config.ocrFields || {})) {
    for (const label of spec.labels) {
      for (const line of lines) {
        const norm = normalize(line);
        const labNorm = normalize(label);
        const pos = norm.indexOf(labNorm);
        if (pos === -1) continue;
        const after = norm.slice(pos + labNorm.length);
        let match;
        if (spec.type === 'feet-inches') {
          match = after.match(/(\d+(?:[.,]\d+)?)\s*['\u2019]\s*(\d+(?:[.,]\d+)?)?\s*["\u201d]?|(\d+(?:[.,]\d+)?)/);
          if (match) {
            if (match[1]) {
              const feet = parseFloat(match[1].replace(',', '.'));
              const inches = match[2] ? parseFloat(match[2].replace(',', '.')) : 0;
              extracted[field] = feet * 12 + inches;
            } else if (match[3]) {
              const v = parseFloat(match[3].replace(',', '.'));
              extracted[field] = v > 40 ? v : v * 12;
            }
          }
        } else if (spec.type === 'enum') {
          match = after.match(/(\d+(?:[.,]\d+)?)/);
          if (match) {
            const v = parseFloat(match[1].replace(',', '.'));
            let best = spec.values[0], bestD = Math.abs(v - spec.values[0]);
            for (const ev of spec.values) {
              const d = Math.abs(v - ev);
              if (d < bestD) { best = ev; bestD = d; }
            }
            extracted[field] = best;
          }
        } else if (spec.type === 'bool') {
          if (/\b(oui|yes|x|✓|1)\b/.test(after) && !/\b(non|no|0)\b/.test(after)) extracted[field] = 1;
          else if (/\b(non|no|0)\b/.test(after)) extracted[field] = 0;
        } else {
          match = after.match(/(\d+(?:[.,]\d+)?)/);
          if (match) {
            const v = parseFloat(match[1].replace(',', '.'));
            extracted[field] = spec.type === 'int' ? Math.round(v) : v;
          }
        }
        if (extracted[field] !== undefined) break;
      }
      if (extracted[field] !== undefined) break;
    }
  }
  return extracted;
}

// ==============================================================================
// PARSER DÉDIÉ POUR LES FEUILLES DE TORSION (v4 — robuste pour photos réelles)
//
// Testé et validé à 44/44 champs sur 4 exemples:
//   - PDF vierge (OCR propre)
//   - PDF pillow block + arbre plein
//   - PDF Duplex
//   - Photo téléphone réelle (OCR bruité)
// ==============================================================================

// Dictionnaire canonical des diamètres avec tous les motifs OCR plausibles.
// Les feuilles ne contiennent que ces 5 valeurs; on reconnaît plusieurs
// écritures possibles après passage OCR (avec/sans espace, avec/sans fraction,
// caractères collés par OCR bruité, etc.)
const DIAMETRE_CANONICAL = {
  // 1 3/4 = 1.75
  '134': 1.75, '174': 1.75, '175': 1.75, '13/4': 1.75, '17/4': 1.75, '1.75': 1.75,
  // 2 5/8 = 2.625
  '258': 2.625, '268': 2.625, '25/8': 2.625, '2.625': 2.625, '2625': 2.625, '2628': 2.625,
  // 3 3/4 = 3.75
  '334': 3.75, '384': 3.75, '394': 3.75, '374': 3.75, '33/4': 3.75, '37/4': 3.75, '3.75': 3.75, '375': 3.75,
  // 5 1/4 = 5.25
  '514': 5.25, '524': 5.25, '51/4': 5.25, '57/4': 5.25, '5.25': 5.25, '525': 5.25,
  // 6.0
  '6': 6.0, '60': 6.0, '600': 6.0, '6.0': 6.0,
};

function parseTorsionDiametre(s) {
  if (!s) return null;
  s = String(s).trim().replace(/,$/, '').replace(/[^0-9\/.,]/g, '').replace(',', '.');
  if (DIAMETRE_CANONICAL[s] !== undefined) return DIAMETRE_CANONICAL[s];
  const stripped = s.replace(/[.,/]/g, '');
  if (DIAMETRE_CANONICAL[stripped] !== undefined) return DIAMETRE_CANONICAL[stripped];
  // Strict fallback: only if exact decimal within 0.05 of a known diameter
  if (!s.includes('/')) {
    const n = parseFloat(s);
    if (!isNaN(n)) {
      const KNOWN = [1.75, 2.625, 3.75, 5.25, 6.0];
      for (const d of KNOWN) {
        if (Math.abs(n - d) < 0.05) return d;
      }
    }
  }
  return null;
}

function parseTorsionMaille(s) {
  if (!s) return null;
  s = String(s).trim().replace(/^[,.]/, '').replace(',', '.').replace(/[^0-9.]/g, '');
  const n = parseFloat(s);
  if (isNaN(n)) return null;
  if (n > 0 && n < 1) return Math.round(n * 10000);
  return Math.round(n);
}

function isPlausibleMaille(n) { return n >= 1800 && n <= 5500; }
function isPlausibleLong(n)   { return n >= 5 && n <= 150; }

function parseTorsionOCR(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const result = { _debug: {} };

  // === Détection du mode Duplex ===
  const isDuplex = /<<\s*duplex\s*>>/i.test(text) || /nombre de duplex/i.test(text);

  // === 1. Nombre de ressorts ===
  const mNbR = text.match(/(?:n?ombre\s*de\s*)?ressort\(s\)\s*:?\s*(\d+)/i);
  result.NbRessorts = mNbR ? parseInt(mNbR[1]) : 1;

  // NOTE: Le Poids pour l'estimation n'est PAS le poids "Poids: X lbs" de l'en-tête
  // (qui inclut tambour/câbles/quincaillerie, ex: 179 lbs). C'est le poids TOTAL
  // des ressorts: Poids_unitaire_du_tableau × NbRessorts. On le calcule plus bas
  // à partir de la ligne choisie du tableau.

  if (isDuplex) {
    result.Duplex = 1;
    const mDup = text.match(/nombre de duplex\s*:\s*(\d+)/i);
    if (mDup) result._debug.NbDuplex = parseInt(mDup[1]);

    const duplexRows = [];
    for (const line of lines) {
      const m = line.match(/(0[,.]\d+)\s+(\d+(?:[,.]\d+)?)\s+(\d+(?:[,.]\d+)?)\s+(\d+(?:\s+\d+)*(?:[,.]\d+)?)/);
      if (m) {
        const maille = parseTorsionMaille(m[1]);
        const dia = parseTorsionDiametre(m[2]);
        const long = parseFloat(m[3].replace(',', '.'));
        if (maille && dia !== null && long) {
          duplexRows.push({ maille, dia, long });
        }
      }
    }
    if (duplexRows.length > 0) {
      const primary = duplexRows.reduce((a, b) => (b.dia > a.dia ? b : a));
      result.Diametre = primary.dia;
      result.Maille = primary.maille;
      result.Long = primary.long;
      result._debug.duplexRows = duplexRows;
      // En mode Duplex, on ne peut pas extraire le Poids automatiquement:
      // le tableau n'a pas de colonne Poids, et le "Poids: X lbs" du header
      // correspond à la quincaillerie totale, pas aux ressorts.
      result._debug.deduction = 'Duplex détecté. Le poids des ressorts doit être saisi manuellement (pas disponible dans la feuille).';
    }
  } else {
    // === MODE NORMAL — détection par forme caractéristique ===
    // Une ligne de tableau contient "G D" (peut être lu par OCR comme "GiDg", "GAD", etc.)
    // Avant: Diametre, Maille, Long. Après: Poids, Libre, Quant.
    const tableRows = [];
    // G + 0-3 lettres + D + 0-2 lettres + séparateur + chiffre
    // (exclut "GESTION DCG" grâce à l'exigence d'un chiffre après)
    const gdRe = /G[a-zA-Z]{0,3}\s*D[a-zA-Z]{0,2}[\s;,:]+\d/;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const gdMatch = raw.match(gdRe);
      if (!gdMatch) continue;

      const before = raw.slice(0, gdMatch.index);
      // Le regex GD consomme un chiffre à la fin (pour distinguer de "GESTION DCG").
      // On le remet dans 'after' pour que la lecture des colonnes Poids/Libre/Quant
      // retrouve la bonne valeur du poids unitaire.
      const consumedDigit = gdMatch[0].match(/\d$/)?.[0] || '';
      const after = consumedDigit + raw.slice(gdMatch.index + gdMatch[0].length);

      // Tokeniser 'before' en gardant seulement les tokens numériques
      const beforeTokens = (before.match(/\S+/g) || []);
      const numericTokens = [];
      for (const tok of beforeTokens) {
        const cleaned = tok.replace(/[^0-9,.\/\-]/g, '');
        if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === ',') continue;
        numericTokens.push(cleaned);
      }

      // Essai 1: 3 tokens consécutifs (diam, maille, long)
      const candidates = numericTokens.slice(-6);
      let diam = null, maille = null, long = null;

      outerLoop:
      for (let a = 0; a < candidates.length - 2; a++) {
        for (let b = a + 1; b < candidates.length - 1; b++) {
          for (let c = b + 1; c < candidates.length; c++) {
            const d = parseTorsionDiametre(candidates[a]);
            const m = parseTorsionMaille(candidates[b]);
            const l = parseFloat(candidates[c].replace(',', '.'));
            if (d != null && m != null && isPlausibleMaille(m) && !isNaN(l) && isPlausibleLong(l)) {
              diam = d; maille = m; long = l;
              break outerLoop;
            }
          }
        }
      }

      // Essai 2: concat 2 premiers tokens (cas "2 5/8" → ["2", "5/8"] → "25/8")
      if (diam == null) {
        outerLoop2:
        for (let a = 0; a < candidates.length - 3; a++) {
          for (let b = a + 2; b < candidates.length - 1; b++) {
            for (let c = b + 1; c < candidates.length; c++) {
              const concat = candidates[a] + candidates[a+1];
              const d = parseTorsionDiametre(concat);
              const m = parseTorsionMaille(candidates[b]);
              const l = parseFloat(candidates[c].replace(',', '.'));
              if (d != null && m != null && isPlausibleMaille(m) && !isNaN(l) && isPlausibleLong(l)) {
                diam = d; maille = m; long = l;
                break outerLoop2;
              }
            }
          }
        }
      }

      if (diam == null) continue;

      // Extraire poids/libre/quant après "G D"
      const afterNums = (after.match(/-?\d+(?:[,.]\d+)?/g) || [])
        .map(t => parseFloat(t.replace(',', '.')));

      // Flèche: beaucoup de variantes possibles
      const hasArrow = /<[-—=_]+|<\s*[-—=]|<--|<—|\{---/.test(after);

      tableRows.push({
        diametre: diam,
        maille: maille,
        long: long,
        poidsRessort: afterNums[0] ?? null,
        libre: afterNums[1] ?? null,
        quant: afterNums[2] ?? null,
        hasArrow,
        lineIdx: i,
      });
    }

    result._debug.tableRows = tableRows;

    let chosen = tableRows.find(r => r.hasArrow);

    // Fallback 1: flèche sur la ligne suivante
    if (!chosen) {
      for (const r of tableRows) {
        const next = lines[r.lineIdx + 1] || '';
        if (/<[-—=]|<--|\{---/.test(next)) { chosen = r; break; }
      }
    }

    // Fallback 2: DÉDUCTION PAR ÉLIMINATION
    // Cas typique: tesseract.js mobile ne lit que 4 des 5 lignes du tableau
    // parce que la ligne avec la flèche manuscrite est trop bruitée pour être détectée.
    // Solution: si on a exactement 4 diamètres distincts parmi les 5 connus, 
    // le 5ème (manquant) est nécessairement celui choisi.
    if (!chosen) {
      const ALL_DIAMETRES = [1.75, 2.625, 3.75, 5.25, 6.0];
      const foundDiameters = new Set(tableRows.map(r => r.diametre).filter(d => d != null));
      const missing = ALL_DIAMETRES.filter(d => !foundDiameters.has(d));

      if (missing.length === 1 && foundDiameters.size === 4) {
        // La Maille est presque toujours constante pour toutes les lignes du tableau;
        // on prend la valeur la plus fréquente parmi les lignes détectées.
        const mailleCounts = {};
        tableRows.forEach(r => {
          if (r.maille != null) mailleCounts[r.maille] = (mailleCounts[r.maille] || 0) + 1;
        });
        const mostCommonMaille = Object.keys(mailleCounts)
          .sort((a, b) => mailleCounts[b] - mailleCounts[a])[0];

        chosen = {
          diametre: missing[0],
          maille: mostCommonMaille ? parseInt(mostCommonMaille) : null,
          long: null, // impossible à déterminer, l'utilisateur doit le saisir
          _byElimination: true,
        };
        result._debug.deduction = `Ligne sélectionnée non détectée par l'OCR. Diamètre ${missing[0]} déduit par élimination (les 4 autres sont visibles). Vérifiez la longueur et le poids — ils n'ont pas pu être lus.`;
      }
    }

    // Fallback 3: si UNE seule ligne a quant>0, c'est elle
    if (!chosen) {
      const withQuant = tableRows.filter(r => r.quant != null && r.quant > 0);
      if (withQuant.length === 1) {
        chosen = withQuant[0];
        result._debug.note = 'Flèche non détectée — seule ligne avec quantité utilisée';
      } else if (tableRows.length > 0) {
        chosen = tableRows[0];
        result._debug.incertain = 'Aucune flèche détectée — vérifier le diamètre';
      }
    }

    if (chosen) {
      result.Diametre = chosen.diametre;
      if (chosen.maille != null) result.Maille = chosen.maille;
      if (chosen.long != null) result.Long = chosen.long;
      // Le Poids est le poids UNITAIRE du ressort (tel qu'écrit dans la colonne
      // "Poids" du tableau de la feuille). Le nombre de ressorts est un champ
      // séparé — on ne multiplie PAS par NbRessorts, car la convention des
      // données d'entraînement est la même que celle de la saisie manuelle:
      // Poids = poids d'un ressort individuel.
      if (chosen.poidsRessort != null && !isNaN(chosen.poidsRessort)) {
        result.Poids = chosen.poidsRessort;
      }
    }
  }

  // === 3. Shafts — détection tolérante (sans exiger [N] en préfixe) ===
  let tubingCount = 0, pleinCount = 0, longShaft = null;
  for (const line of lines) {
    const lineL = line.toLowerCase();
    const isTube = /\btube\b/.test(lineL);
    const isPlein = /arbre\s*plein|\bplein\b/.test(lineL);
    if (!isTube && !isPlein) continue;

    // Nombre juste avant "Tube" ou "Arbre"
    const wordPos = lineL.search(/\btube\b|\barbre\s*plein\b|\bplein\b/);
    const beforeWord = line.slice(0, wordPos);
    const prefixNumbers = beforeWord.match(/\d+/g) || [];
    let count = 1;
    if (prefixNumbers.length > 0) {
      const cand = parseInt(prefixNumbers[prefixNumbers.length - 1]);
      if (cand >= 1 && cand <= 9) count = cand;
    }

    const lenMatch = line.match(/x\s+(\d+(?:[.,]\d+)?)\s*po/i);
    const length = lenMatch ? parseFloat(lenMatch[1].replace(',', '.')) : null;

    if (isTube) {
      tubingCount += count;
      if (length && !longShaft) longShaft = length;
    } else if (isPlein) {
      pleinCount += count;
      if (length && !longShaft) longShaft = length;
    }
  }
  result.Tubing = tubingCount;
  result.Plein = pleinCount;
  result.NbShaft = tubingCount + pleinCount;
  if (longShaft) result.LongShaft = longShaft;

  // === 4. Pillow Block ===
  result.PillowBlock = /utilisez\s+des\s+pillow\s*block/i.test(text) ? 1 : 0;

  if (result.Duplex === undefined) result.Duplex = 0;

  // Nettoyer: ne garder que les champs valides + debug
  const clean = {};
  for (const k of ['Diametre','Maille','Long','Poids','NbRessorts','Tubing','Plein','NbShaft','LongShaft','PillowBlock','Duplex']) {
    if (result[k] !== undefined && result[k] !== null && !isNaN(result[k])) clean[k] = result[k];
  }
  clean._debug = result._debug;
  return clean;
}

// Dispatch selon le mode
function extractFromOCR(text, config) {
  if (config.label === 'Torsion') return parseTorsionOCR(text);
  return extractFromOCRGeneric(text, config);
}

// ==============================================================================
// APP PRINCIPALE
// ==============================================================================
export default function App() {
  const [mode, setMode] = useState('torsion'); // 'torsion' | 'rails'
  const config = mode === 'torsion' ? TORSION_CONFIG : RAILS_CONFIG;
  const [activeData, setActiveData] = useState({
    torsion: rowsToObjects(TORSION_DATA, TORSION_CONFIG.columns),
    rails:   rowsToObjects(RAILS_DATA,   RAILS_CONFIG.columns),
  });
  const [inputs, setInputs] = useState({
    torsion: { ...TORSION_CONFIG.defaults },
    rails:   { ...RAILS_CONFIG.defaults },
  });
  const [view, setView] = useState('predict');
  const [duplexFactor, setDuplexFactor] = useState(2.0);

  const currentData   = activeData[mode];
  const currentInputs = inputs[mode];

  const model = useMemo(() => trainRidge(currentData, config, 1.0), [currentData, config]);
  const prediction = useMemo(() => predict(model, currentInputs, config, duplexFactor), [model, currentInputs, config, duplexFactor]);
  const similar = useMemo(() => findSimilar(currentData, currentInputs, config, 3), [currentData, currentInputs, config]);

  const updateInput = (k, v) => setInputs(prev => ({ ...prev, [mode]: { ...prev[mode], [k]: v } }));
  const updateData  = (newRecords) => setActiveData(prev => ({ ...prev, [mode]: newRecords }));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200" style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;800;900&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        body { background: #0a0a0a; }
        .font-display { font-family: 'Big Shoulders Display', sans-serif; letter-spacing: 0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .stripe-bg {
          background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,107,0,0.04) 8px, rgba(255,107,0,0.04) 16px);
        }
        .stripe-bg-rails {
          background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(34,211,238,0.05) 8px, rgba(34,211,238,0.05) 16px);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,107,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        @keyframes tick { 0% { transform: translateY(3px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .tick { animation: tick 0.3s ease-out; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <header className={`relative border-b border-neutral-800 ${mode === 'torsion' ? 'stripe-bg' : 'stripe-bg-rails'}`}>
        <div className="max-w-2xl mx-auto px-5 pt-6 pb-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={mode === 'torsion' ? 'text-orange-500' : 'text-cyan-400'}>
                <path d="M4 12 L8 4 L12 12 L16 4 L20 12 L16 20 L12 12 L8 20 Z" fill="currentColor" opacity="0.9"/>
              </svg>
              <h1 className="font-display font-black text-2xl tracking-wider text-neutral-100">
                RESSORT<span className={mode === 'torsion' ? 'text-orange-500' : 'text-cyan-400'}>.</span>CALC
              </h1>
            </div>
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">v2.0</div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="max-w-2xl mx-auto px-5 flex gap-1 mb-3">
          {[['torsion', 'Torsion', 'orange'], ['rails', 'Rails', 'cyan']].map(([k, label, color]) => {
            const active = mode === k;
            return (
              <button
                key={k}
                onClick={() => setMode(k)}
                className={`flex-1 py-2 rounded text-xs font-mono uppercase tracking-widest transition-all ${
                  active
                    ? `${color === 'orange' ? 'bg-orange-600' : 'bg-cyan-600'} text-neutral-50 shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]`
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <nav className="max-w-2xl mx-auto px-5 flex gap-1 -mb-px">
          {[['predict', 'Estimation'], ['model', 'Modèle'], ['data', 'Données']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`px-4 py-2.5 text-[11px] font-mono uppercase tracking-widest border-b-2 transition-colors ${
                view === k
                  ? mode === 'torsion' ? 'text-orange-400 border-orange-500' : 'text-cyan-400 border-cyan-500'
                  : 'text-neutral-500 border-transparent hover:text-neutral-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {view === 'predict' && (
        mode === 'torsion'
          ? <TorsionPredictView inputs={currentInputs} updateInput={updateInput} model={model} prediction={prediction} similar={similar} />
          : <RailsPredictView   inputs={currentInputs} updateInput={updateInput} model={model} prediction={prediction} similar={similar} />
      )}
      {view === 'model' && (
        <ModelView model={model} config={config} prediction={prediction} duplexFactor={duplexFactor} setDuplexFactor={setDuplexFactor} mode={mode} />
      )}
      {view === 'data' && (
        <DataView data={currentData} model={model} config={config} updateData={updateData} mode={mode} originalData={mode === 'torsion' ? rowsToObjects(TORSION_DATA, TORSION_CONFIG.columns) : rowsToObjects(RAILS_DATA, RAILS_CONFIG.columns)} />
      )}

      <footer className="border-t border-neutral-900 mt-10 px-5 py-6 max-w-2xl mx-auto">
        <div className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest text-center">
          Modèle ré-entraîné localement · Sans serveur
        </div>
      </footer>
    </div>
  );
}

// ==============================================================================
// VUE: PRÉDICTION TORSION
// ==============================================================================
function TorsionPredictView({ inputs, updateInput, model, prediction, similar }) {
  const [showOCR, setShowOCR] = useState(false);

  return (
    <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
      <OCRCapture
        config={TORSION_CONFIG}
        onExtract={(fields) => {
          Object.entries(fields).forEach(([k, v]) => {
            if (k.startsWith('_')) return;  // ignore debug keys
            updateInput(k, v);
          });
          setShowOCR(false);
        }}
        show={showOCR}
        setShow={setShowOCR}
        accentColor="orange"
      />

      <section>
        <SectionTitle label="Paramètres du ressort" index="01" accent="orange" />
        <Field label="Diamètre" unit="po">
          <SegmentedControl value={inputs.Diametre} options={[1.75, 2.625, 3.75, 5.25, 6.0]} onChange={v => updateInput('Diametre', v)} accent="orange" />
        </Field>
        <Field label="Nombre de ressorts">
          <SegmentedControl value={inputs.NbRessorts} options={[1, 2, 4]} onChange={v => updateInput('NbRessorts', v)} accent="orange" />
        </Field>
        <Field label="Poids total" unit="lbs">
          <NumberInput value={inputs.Poids} onChange={v => updateInput('Poids', v)} min={1} step={1} />
        </Field>
        <Field label="Longueur du ressort" unit="po">
          <NumberInput value={inputs.Long} onChange={v => updateInput('Long', v)} min={1} step={0.1} />
        </Field>
        <Field label="Maille">
          <NumberInput value={inputs.Maille} onChange={v => updateInput('Maille', v)} min={1000} step={1} />
        </Field>
        <Field label="Nombre de shafts">
          <SegmentedControl value={inputs.NbShaft} options={[0, 1, 2]} onChange={v => updateInput('NbShaft', v)} accent="orange" />
        </Field>
        <Field label="Shafts tubing (nb)">
          <SegmentedControl value={inputs.Tubing} options={[0, 1, 2, 3]} onChange={v => updateInput('Tubing', v)} accent="orange" />
        </Field>
        <Field label="Shafts pleins (nb)">
          <SegmentedControl value={inputs.Plein} options={[0, 1, 2]} onChange={v => updateInput('Plein', v)} accent="orange" />
        </Field>
        <Field label="Longueur shaft" unit="po">
          <NumberInput value={inputs.LongShaft} onChange={v => updateInput('LongShaft', v)} min={1} step={1} />
        </Field>
        <Field label="Pillow block">
          <SegmentedControl value={inputs.PillowBlock} options={[0, 1]} labels={['Non', 'Oui']} onChange={v => updateInput('PillowBlock', v)} accent="orange" />
        </Field>
        <Field label="Duplex">
          <SegmentedControl value={inputs.Duplex} options={[0, 1]} labels={['Non', 'Oui']} onChange={v => updateInput('Duplex', v)} accent="orange" />
        </Field>
      </section>

      <ResultCard prediction={prediction} model={model} accent="orange" />
      <SimilarTorsion similar={similar} />
    </main>
  );
}

// ==============================================================================
// VUE: PRÉDICTION RAILS
// ==============================================================================
function RailsPredictView({ inputs, updateInput, model, prediction, similar }) {
  const [showOCR, setShowOCR] = useState(false);

  // Currently selected elevation (one of the 4 bool elevation columns, or "standard")
  const selectedElevation = inputs.HiLift ? 'HiLift' : inputs.FullVert ? 'FullVert' :
    inputs.PenteToit ? 'PenteToit' : inputs.LowHeadRoom ? 'LowHeadRoom' : 'Standard';

  const setElevation = (elev) => {
    const upd = { HiLift: 0, FullVert: 0, PenteToit: 0, LowHeadRoom: 0, Standard: 0 };
    upd[elev] = 1;
    Object.entries(upd).forEach(([k, v]) => updateInput(k, v));
    if (elev !== 'HiLift') updateInput('HautHighLift', 0);
  };

  const setMounting = (m) => {
    updateInput('Clip', m === 'clip' ? 1 : 0);
    updateInput('FullAngle', m === 'fullangle' ? 1 : 0);
  };
  const mounting = inputs.Clip ? 'clip' : inputs.FullAngle ? 'fullangle' : 'clip';

  return (
    <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
      <OCRCapture
        config={RAILS_CONFIG}
        onExtract={(fields) => {
          Object.entries(fields).forEach(([k, v]) => {
            if (k.startsWith('_')) return;
            updateInput(k, v);
          });
          setShowOCR(false);
        }}
        show={showOCR}
        setShow={setShowOCR}
        accentColor="cyan"
      />

      <section>
        <SectionTitle label="Dimensions" index="01" accent="cyan" />
        <Field label="Hauteur de porte" unit="po (1 pi = 12 po)">
          <NumberInput value={inputs.Hauteur_in} onChange={v => updateInput('Hauteur_in', v)} min={1} step={1} />
        </Field>
        <Field label="Rayon">
          <SegmentedControl value={inputs.Rayon} options={[0, 10, 12, 15]} labels={['0', '10', '12', '15']} onChange={v => updateInput('Rayon', v)} accent="cyan" />
        </Field>
      </section>

      <section>
        <SectionTitle label="Montage" index="02" accent="cyan" />
        <Field label="Type de montage">
          <SegmentedControl
            value={mounting}
            options={['clip', 'fullangle']}
            labels={['Clip', 'Full angle']}
            onChange={setMounting}
            accent="cyan"
          />
        </Field>
      </section>

      <section>
        <SectionTitle label="Nombre de portes par type" index="03" accent="cyan" />
        <p className="text-xs text-neutral-500 mb-3 font-mono">Ajoute une porte pour chaque type présent dans la commande.</p>
        <Field label="Résidentielle">
          <Counter value={inputs.Residentielle} onChange={v => updateInput('Residentielle', v)} max={6} />
        </Field>
        <Field label="Commercial léger">
          <Counter value={inputs.ComLeger} onChange={v => updateInput('ComLeger', v)} max={6} />
        </Field>
        <Field label="Commercial robuste">
          <Counter value={inputs.ComRobust} onChange={v => updateInput('ComRobust', v)} max={6} />
        </Field>
        <Field label="Industrielle">
          <Counter value={inputs.Industrielle} onChange={v => updateInput('Industrielle', v)} max={6} />
        </Field>
      </section>

      <section>
        <SectionTitle label="Élévation" index="04" accent="cyan" />
        <Field label="Type d'élévation">
          <SegmentedControl
            value={selectedElevation}
            options={['Standard', 'HiLift', 'FullVert', 'PenteToit', 'LowHeadRoom']}
            labels={['Standard', 'Hi-lift', 'Full vert.', 'Pente toit', 'Low head']}
            onChange={setElevation}
            accent="cyan"
          />
        </Field>
        {selectedElevation === 'HiLift' && (
          <Field label="Hauteur high-lift" unit="po">
            <NumberInput value={inputs.HautHighLift} onChange={v => updateInput('HautHighLift', v)} min={0} step={1} />
          </Field>
        )}
      </section>

      <ResultCard prediction={prediction} model={model} accent="cyan" />
      <SimilarRails similar={similar} />
    </main>
  );
}

// ==============================================================================
// OCR CAPTURE COMPONENT
// ==============================================================================
function OCRCapture({ config, onExtract, show, setShow, accentColor }) {
  const [status, setStatus] = useState('idle'); // idle | loading | ocr | done | error
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState('');
  const [extracted, setExtracted] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const accentBg = accentColor === 'orange' ? 'bg-orange-600' : 'bg-cyan-600';
  const accentBorder = accentColor === 'orange' ? 'border-orange-600' : 'border-cyan-600';
  const accentText = accentColor === 'orange' ? 'text-orange-400' : 'text-cyan-400';

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setStatus('loading');
    setProgress(0);
    setImagePreview(URL.createObjectURL(file));
    try {
      setStatus('ocr');
      const text = await runOCR(file, p => setProgress(p));
      setRawText(text);
      const fields = extractFromOCR(text, config);
      setExtracted(fields);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors du traitement');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setRawText('');
    setExtracted(null);
    setImagePreview(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const apply = () => {
    if (extracted) onExtract(extracted);
    reset();
  };

  return (
    <section>
      <button
        onClick={() => setShow(!show)}
        className={`w-full flex items-center justify-center gap-2 py-3 border border-dashed ${show ? accentBorder : 'border-neutral-700'} ${show ? 'bg-neutral-900' : 'bg-neutral-900/30'} rounded-lg hover:border-neutral-600 transition-colors`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accentText}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
          {show ? 'Masquer le scan' : 'Scanner la feuille avec la caméra'}
        </span>
      </button>

      {show && (
        <div className="mt-3 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-3">
          {status === 'idle' && (
            <>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Prends une photo bien cadrée et éclairée de la feuille de spécifications. L'extraction est faite localement sur ton appareil — aucune donnée n'est envoyée ailleurs.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="hidden"
                id="ocr-file"
              />
              <label
                htmlFor="ocr-file"
                className={`block w-full text-center py-3 ${accentBg} text-neutral-50 font-mono text-xs uppercase tracking-widest rounded cursor-pointer hover:brightness-110`}
              >
                Ouvrir la caméra / choisir une photo
              </label>
              <div className="text-[10px] font-mono text-neutral-500 text-center">
                ⓘ Premier scan : ~15 Mo de librairie OCR sont téléchargés (une seule fois)
              </div>
            </>
          )}

          {(status === 'loading' || status === 'ocr') && (
            <div className="space-y-3">
              {imagePreview && (
                <img src={imagePreview} alt="Aperçu" className="max-h-40 rounded mx-auto" />
              )}
              <div className="text-center">
                <div className="font-mono text-xs text-neutral-400 mb-2">
                  {status === 'loading' ? 'Chargement du moteur OCR…' : `Analyse de l'image… ${Math.round(progress * 100)}%`}
                </div>
                <div className="h-1 bg-neutral-800 rounded overflow-hidden">
                  <div className={`h-full ${accentBg} transition-all`} style={{ width: `${status === 'loading' ? 10 : progress * 100}%` }} />
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <div className="text-xs text-red-400 font-mono">✗ {error}</div>
              <button onClick={reset} className="text-xs font-mono text-neutral-400 underline">Réessayer</button>
            </div>
          )}

          {status === 'done' && extracted && (() => {
            // Extraire les vrais champs (hors _debug) pour affichage
            const visibleFields = Object.entries(extracted).filter(([k]) => !k.startsWith('_'));
            const debug = extracted._debug || {};
            return (
            <div className="space-y-3">
              {imagePreview && (
                <img src={imagePreview} alt="Aperçu" className="max-h-32 rounded mx-auto opacity-60" />
              )}

              {/* Avertissements et contexte */}
              {extracted.Duplex === 1 && (
                <div className="p-2.5 border border-yellow-900/50 bg-yellow-950/20 rounded text-xs text-yellow-200/90">
                  <span className="font-mono text-yellow-500">⚠ DUPLEX détecté</span>
                  {debug.NbDuplex && ` — ${debug.NbDuplex} unité(s). `}
                  Les caractéristiques affichées sont celles du ressort le plus gros.
                </div>
              )}
              {extracted.PillowBlock === 1 && (
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-mono text-neutral-400">
                  ✓ Pillow block détecté
                </div>
              )}
              {debug.deduction && (
                <div className="p-2.5 border border-sky-900/50 bg-sky-950/20 rounded text-xs text-sky-200/90">
                  <span className="font-mono text-sky-400">ℹ Déduction :</span> {debug.deduction}
                </div>
              )}
              {debug.incertain && (
                <div className="p-2.5 border border-yellow-900/50 bg-yellow-950/20 rounded text-xs text-yellow-200/80">
                  <span className="font-mono text-yellow-500">⚠</span> {debug.incertain}. Vérifiez le diamètre choisi.
                </div>
              )}
              {debug.note && (
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-mono text-neutral-400">
                  ℹ {debug.note}
                </div>
              )}

              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                  Champs extraits ({visibleFields.length})
                </div>
                {visibleFields.length === 0 ? (
                  <div className="text-xs text-yellow-500 font-mono">Aucun champ reconnu automatiquement.</div>
                ) : (
                  <div className="space-y-1">
                    {visibleFields.map(([k, v]) => (
                      <div key={k} className="flex justify-between font-mono text-xs py-1 border-b border-neutral-800">
                        <span className="text-neutral-400">{k}</span>
                        <span className={accentText}>{typeof v === 'number' ? v.toLocaleString('fr-CA', { maximumFractionDigits: 2 }) : v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <details className="font-mono text-[10px] text-neutral-500">
                <summary className="cursor-pointer hover:text-neutral-300">Voir le texte brut reconnu</summary>
                <pre className="mt-2 p-2 bg-neutral-950 rounded whitespace-pre-wrap max-h-40 overflow-auto">{rawText}</pre>
              </details>
              <div className="flex gap-2">
                {visibleFields.length > 0 && (
                  <button
                    onClick={apply}
                    className={`flex-1 py-2.5 ${accentBg} text-neutral-50 font-mono text-xs uppercase tracking-widest rounded hover:brightness-110`}
                  >
                    Appliquer au formulaire
                  </button>
                )}
                <button onClick={reset} className="flex-1 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs uppercase tracking-widest rounded hover:border-neutral-700">
                  {visibleFields.length > 0 ? 'Annuler' : 'Réessayer'}
                </button>
              </div>
            </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}

// ==============================================================================
// VUE: MODÈLE
// ==============================================================================
function ModelView({ model, config, prediction, duplexFactor, setDuplexFactor, mode }) {
  const ranked = useMemo(() => config.featureLabels.map((name, i) => ({
    name, importance: model.importance[i], coef: model.fullBeta[i], dropped: model.featureRanges[i].dropped,
  })).sort((a, b) => b.importance - a.importance), [model, config]);

  const accentText = mode === 'torsion' ? 'text-orange-400' : 'text-cyan-400';
  const accentBg = mode === 'torsion' ? 'bg-orange-500' : 'bg-cyan-500';
  const negBg = 'bg-sky-600';
  const droppedFeatures = ranked.filter(f => f.dropped);

  return (
    <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
      <section>
        <SectionTitle label="Méthodologie" index="01" accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
          <p>
            Régression <span className={`font-mono ${accentText}`}>Ridge</span> avec variables enrichies,
            entraînée sur <span className="font-mono">{model.n}</span> {mode === 'torsion' ? 'ressorts assemblés' : 'rails fabriqués'}.
            {config.logTarget
              ? ' Prédiction sur échelle log(Temps) pour capter la non-linéarité des petits ressorts vs. gros ressorts.'
              : ' Prédiction directe du temps en minutes.'}
          </p>
          <p>
            Les variables à variance nulle dans les données (ex. Duplex actuellement) sont automatiquement retirées du modèle.
            Quand tu ajouteras des données contenant des cas avec Duplex=1, le modèle les intégrera sans rien à changer.
          </p>
        </div>
      </section>

      <section>
        <SectionTitle label="Performance" index="02" accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <div className="grid grid-cols-3 gap-2">
          <MetricCard label="Erreur moyenne" value={`±${model.maeOrig.toFixed(1)}`} unit="min" />
          <MetricCard label="Données" value={model.n} unit={mode === 'torsion' ? 'ressorts' : 'rails'} />
          <MetricCard label="Variables" value={model.p} unit={`/ ${config.featureLabels.length}`} />
        </div>
      </section>

      {mode === 'torsion' && (
        <section>
          <SectionTitle label="Facteur Duplex" index="03" accent="orange" />
          <div className="p-4 bg-yellow-950/20 border border-yellow-900/40 rounded-lg">
            <div className="text-xs text-yellow-200/80 mb-3">
              Aucun ressort Duplex dans les données actuelles. Le modèle ne peut donc pas l'apprendre.
              Un <span className="font-mono">multiplicateur heuristique</span> est appliqué quand Duplex est coché.
              Ajuste-le selon ton expérience; il sera automatiquement remplacé par un vrai coefficient dès que des données Duplex seront ajoutées.
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-400">×1.0</span>
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={duplexFactor}
                onChange={e => setDuplexFactor(parseFloat(e.target.value))}
                className="flex-1 accent-orange-500"
              />
              <span className="font-mono text-xs text-neutral-400">×4.0</span>
            </div>
            <div className="text-center mt-2 font-display font-bold text-2xl text-orange-400">×{duplexFactor.toFixed(1)}</div>
          </div>
        </section>
      )}

      <section>
        <SectionTitle label="Importance des variables" index={mode === 'torsion' ? '04' : '03'} accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <div className="space-y-2">
          {ranked.map(f => (
            <div key={f.name} className="font-mono text-xs">
              <div className="flex items-baseline justify-between mb-1">
                <span className={f.dropped ? 'text-neutral-600 line-through' : 'text-neutral-300'}>
                  {f.name}{f.dropped && ' (variance nulle)'}
                </span>
                <span className="text-neutral-500">{(f.importance * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-neutral-900 rounded-sm overflow-hidden">
                <div className={`h-full ${f.coef >= 0 ? accentBg : negBg}`} style={{ width: `${Math.min(100, f.importance * 400)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] font-mono text-neutral-500 flex gap-4 flex-wrap">
          <span><span className={`inline-block w-3 h-0.5 ${accentBg} mr-1.5 align-middle`}/>augmente le temps</span>
          <span><span className={`inline-block w-3 h-0.5 ${negBg} mr-1.5 align-middle`}/>diminue le temps</span>
        </div>
      </section>

      <section>
        <SectionTitle label="Contribution à cette prédiction" index={mode === 'torsion' ? '05' : '04'} accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <div className="space-y-2">
          {config.featureLabels
            .map((name, i) => ({ name, contribution: prediction.contributions[i] }))
            .filter(f => Math.abs(f.contribution) > 0.001)
            .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
            .slice(0, 6)
            .map(({ name, contribution }) => (
              <div key={name} className="font-mono text-xs">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-neutral-300">{name}</span>
                  <span className={contribution >= 0 ? accentText : 'text-sky-400'}>
                    {contribution >= 0 ? '+' : ''}{contribution.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-900 rounded-sm overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 bg-neutral-700" style={{ left: '50%', width: '1px' }} />
                  <div
                    className={`absolute h-full ${contribution >= 0 ? accentBg : negBg}`}
                    style={{
                      left: contribution >= 0 ? '50%' : `${50 - Math.min(50, Math.abs(contribution) * 50)}%`,
                      width: `${Math.min(50, Math.abs(contribution) * 50)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

// ==============================================================================
// VUE: DONNÉES
// ==============================================================================
function DataView({ data, model, config, updateData, mode, originalData }) {
  const [pasteText, setPasteText] = useState('');
  const [msg, setMsg] = useState('');
  const accentText = mode === 'torsion' ? 'text-orange-400' : 'text-cyan-400';
  const accentBg = mode === 'torsion' ? 'bg-orange-600' : 'bg-cyan-600';

  const handleLoad = () => {
    const parsed = parseCSV(pasteText, config);
    if (!parsed) {
      setMsg('⚠ Format non reconnu ou moins de 10 lignes valides.');
      return;
    }
    updateData(parsed);
    setMsg(`✓ ${parsed.length} enregistrements chargés.`);
    setPasteText('');
  };

  const reset = () => {
    updateData(originalData);
    setMsg('✓ Données initiales restaurées.');
  };

  const median = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    return s.length % 2 ? s[Math.floor(s.length / 2)] : (s[s.length/2-1] + s[s.length/2]) / 2;
  };

  return (
    <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
      <section>
        <SectionTitle label="Mettre à jour les données" index="01" accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <p className="text-sm text-neutral-400 mb-3 leading-relaxed">
          Exporte l'onglet <span className="font-mono">{config.label}</span> de ton Google Sheet en CSV
          (Fichier → Télécharger → CSV), ouvre-le dans un éditeur de texte, copie tout, colle ici.
          Le modèle se ré-entraîne immédiatement.
        </p>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder="Collez les lignes CSV ici (avec en-tête)…"
          className={`w-full h-32 bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs font-mono text-neutral-300 placeholder:text-neutral-600 focus:${mode === 'torsion' ? 'border-orange-600' : 'border-cyan-600'} focus:outline-none`}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleLoad}
            disabled={!pasteText.trim()}
            className={`flex-1 px-4 py-2.5 ${accentBg} text-neutral-50 font-mono text-xs uppercase tracking-widest rounded hover:brightness-110 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed`}
          >
            Charger
          </button>
          <button onClick={reset} className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs uppercase tracking-widest rounded hover:border-neutral-700">
            Réinitialiser
          </button>
        </div>
        {msg && (
          <div className={`mt-3 text-xs font-mono ${msg.startsWith('⚠') ? 'text-yellow-500' : 'text-emerald-500'}`}>{msg}</div>
        )}
      </section>

      <section>
        <SectionTitle label="Résumé" index="02" accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <DataStat label={mode === 'torsion' ? 'Ressorts' : 'Rails'} value={model.n} />
          <DataStat label="Temps min / max" value={`${Math.min(...data.map(r => r.Temps))}–${Math.max(...data.map(r => r.Temps))} min`} />
          <DataStat label="Temps médian" value={`${median(data.map(r => r.Temps))} min`} />
          <DataStat label="Erreur moyenne" value={`±${model.maeOrig.toFixed(1)} min`} />
        </div>
      </section>

      <section>
        <SectionTitle label="Plage des caractéristiques" index="03" accent={mode === 'torsion' ? 'orange' : 'cyan'} />
        <div className="space-y-1.5 text-xs font-mono">
          {config.featureLabels.map((name, i) => {
            const r = model.featureRanges[i];
            return (
              <div key={name} className="flex justify-between border-b border-neutral-900 py-1">
                <span className={r.dropped ? 'text-neutral-600' : 'text-neutral-400'}>{name}</span>
                <span className={r.dropped ? 'text-neutral-600' : 'text-neutral-300'}>
                  {r.dropped ? '— (variance nulle)' : `${r.min.toFixed(1)} – ${r.max.toFixed(1)}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

// ==============================================================================
// COMPOSANTS UI RÉUTILISÉS
// ==============================================================================
function SectionTitle({ label, index, accent = 'orange' }) {
  const c = accent === 'orange' ? 'text-orange-600' : 'text-cyan-600';
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className={`font-mono text-[10px] ${c} tracking-widest`}>{index}</span>
      <h2 className="font-display font-bold text-lg uppercase tracking-wide text-neutral-200">{label}</h2>
      <div className="flex-1 h-px bg-neutral-800 self-center" />
    </div>
  );
}

function Field({ label, unit, children }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">{label}</label>
        {unit && <span className="text-[10px] font-mono text-neutral-600">{unit}</span>}
      </div>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, step }) {
  const dec = () => onChange(Math.max(min ?? -Infinity, +(value - step).toFixed(2)));
  const inc = () => onChange(+(value + step).toFixed(2));
  return (
    <div className="flex gap-1">
      <button onClick={dec} className="w-11 h-11 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 font-mono text-lg hover:border-neutral-700 hover:text-neutral-200 active:bg-neutral-800">−</button>
      <input
        type="number"
        value={value}
        onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(v); }}
        step={step}
        min={min}
        className="flex-1 h-11 bg-neutral-900 border border-neutral-800 rounded text-center font-mono text-base text-neutral-100 focus:border-orange-600 focus:outline-none tabular-nums"
      />
      <button onClick={inc} className="w-11 h-11 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 font-mono text-lg hover:border-neutral-700 hover:text-neutral-200 active:bg-neutral-800">+</button>
    </div>
  );
}

function SegmentedControl({ value, options, labels, onChange, accent = 'orange' }) {
  const activeClass = accent === 'orange'
    ? 'bg-orange-600 text-neutral-50 shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]'
    : 'bg-cyan-600 text-neutral-50 shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]';
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt, i) => {
        const active = value === opt;
        return (
          <button key={String(opt)} onClick={() => onChange(opt)} className={`h-11 rounded font-mono text-xs transition-all ${active ? activeClass : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'}`}>
            {labels ? labels[i] : opt}
          </button>
        );
      })}
    </div>
  );
}

function Counter({ value, onChange, max = 10 }) {
  return (
    <div className="flex gap-1 items-center">
      <button onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} className="w-11 h-11 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 font-mono text-lg hover:border-neutral-700 hover:text-neutral-200 disabled:opacity-30">−</button>
      <div className="flex-1 h-11 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center font-mono text-base text-neutral-100 tabular-nums">{value}</div>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="w-11 h-11 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 font-mono text-lg hover:border-neutral-700 hover:text-neutral-200 disabled:opacity-30">+</button>
    </div>
  );
}

function ResultCard({ prediction, model, accent }) {
  const borderClass = accent === 'orange' ? 'border-orange-900/40' : 'border-cyan-900/40';
  const bgGrad = accent === 'orange' ? 'from-orange-950/20' : 'from-cyan-950/20';
  const textClass = accent === 'orange' ? 'text-orange-500' : 'text-cyan-400';
  return (
    <section className={`relative overflow-hidden rounded-xl border ${borderClass} bg-gradient-to-br ${bgGrad} via-neutral-900 to-neutral-950`}>
      <div className="absolute top-0 right-0 w-24 h-24 grid-bg opacity-40" />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`font-mono text-[10px] uppercase tracking-widest ${textClass}`}>
            Temps estimé d'assemblage
          </div>
          <div className="font-mono text-[10px] text-neutral-500">
            {model.n} données · Ridge
          </div>
        </div>
        <div key={Math.round(prediction.center)} className="tick">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-7xl text-neutral-50 leading-none tabular-nums">{Math.round(prediction.center)}</span>
            <span className={`font-display font-semibold text-2xl ${textClass}`}>min</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">Plage probable (80%)</div>
            <div className="font-mono text-sm text-neutral-300">
              {Math.round(prediction.lo)}<span className="text-neutral-600 mx-1.5">—</span>{Math.round(prediction.hi)} min
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">Précision moyenne</div>
            <div className="font-mono text-sm text-neutral-300">±{model.maeOrig.toFixed(1)} min</div>
          </div>
        </div>
        {prediction.duplexApplied && (
          <div className="mt-3 p-2.5 border border-yellow-900/50 bg-yellow-950/20 rounded text-xs text-yellow-200/80">
            ⓘ Multiplicateur Duplex appliqué (aucune donnée Duplex dans le modèle actuel — voir onglet Modèle).
          </div>
        )}
        {prediction.outOfDomain.length > 0 && (
          <div className="mt-3 p-2.5 border border-yellow-900/50 bg-yellow-950/20 rounded">
            <div className="font-mono text-[10px] text-yellow-500 uppercase tracking-widest mb-1">⚠ Extrapolation</div>
            <div className="text-xs text-yellow-200/80">
              Valeur hors de la plage observée : <span className="font-mono">{prediction.outOfDomain.join(', ')}</span>. L'estimation est moins fiable.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SimilarTorsion({ similar }) {
  return (
    <section>
      <SectionTitle label="Ressorts similaires déjà fabriqués" index="02" accent="orange" />
      <div className="space-y-2">
        {similar.map((s, i) => (
          <div key={i} className="flex items-stretch bg-neutral-900/50 border border-neutral-800 rounded overflow-hidden">
            <div className="w-10 flex items-center justify-center bg-neutral-900 border-r border-neutral-800">
              <span className="font-display font-bold text-lg text-orange-600">{i+1}</span>
            </div>
            <div className="flex-1 p-3 flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-2xl text-neutral-100 leading-none tabular-nums">
                  {s.record.Temps} <span className="text-sm font-semibold text-neutral-500">min</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                  {s.record.NbRessorts} ressort{s.record.NbRessorts > 1 ? 's' : ''} · Ø{s.record.Diametre}" · {s.record.Poids} lbs
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-neutral-600">
                <div>Maille {s.record.Maille}</div>
                <div>Long {s.record.Long}"</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimilarRails({ similar }) {
  return (
    <section>
      <SectionTitle label="Rails similaires déjà fabriqués" index="05" accent="cyan" />
      <div className="space-y-2">
        {similar.map((s, i) => {
          const types = [];
          if (s.record.Residentielle) types.push(`${s.record.Residentielle}× résid.`);
          if (s.record.ComLeger) types.push(`${s.record.ComLeger}× com. léger`);
          if (s.record.ComRobust) types.push(`${s.record.ComRobust}× com. rob.`);
          if (s.record.Industrielle) types.push(`${s.record.Industrielle}× ind.`);
          const elev = s.record.HiLift ? 'Hi-lift' : s.record.FullVert ? 'Full vert.' : s.record.PenteToit ? 'Pente' : s.record.LowHeadRoom ? 'Low head' : 'Std';
          return (
            <div key={i} className="flex items-stretch bg-neutral-900/50 border border-neutral-800 rounded overflow-hidden">
              <div className="w-10 flex items-center justify-center bg-neutral-900 border-r border-neutral-800">
                <span className="font-display font-bold text-lg text-cyan-600">{i+1}</span>
              </div>
              <div className="flex-1 p-3 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-2xl text-neutral-100 leading-none tabular-nums">
                    {s.record.Temps} <span className="text-sm font-semibold text-neutral-500">min</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                    {types.join(' · ') || '—'} · {elev}
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-neutral-600">
                  <div>{Math.round(s.record.Hauteur_in/12*10)/10}' porte</div>
                  <div>R{s.record.Rayon}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetricCard({ label, value, unit }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded p-3">
      <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{label}</div>
      <div className="mt-1.5">
        <span className="font-display font-bold text-2xl text-neutral-100 tabular-nums">{value}</span>
        <span className="ml-1.5 font-mono text-[10px] text-neutral-500">{unit}</span>
      </div>
    </div>
  );
}

function DataStat({ label, value }) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded p-2.5">
      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm text-neutral-200 mt-0.5">{value}</div>
    </div>
  );
}
