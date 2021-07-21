const dummyGalery = [
  {
    src: 'https://images.unsplash.com/photo-1579103805048-54c1d7823a9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1060&q=80',
    width: 1060,
    height: 698,
    alt: 'Larissa Paschoalotto Foto de Galeria 01',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1566455121867-a59951c0bfda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    width: 800,
    height: 800,
    alt: 'Larissa Paschoalotto Foto de Galeria 02',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1543097692-fa13c6cd8595?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    width: 1050,
    height: 701,
    alt: 'Larissa Paschoalotto Foto de Galeria 03',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    width: 1050,
    height: 700,
    alt: 'Larissa Paschoalotto Foto de Galeria 04',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1517309230475-6736d926b979?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    width: 1050,
    height: 700,
    alt: 'Larissa Paschoalotto Foto de Galeria 05',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1516545595035-b494dd0161e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    width: 1050,
    height: 700,
    alt: 'Larissa Paschoalotto Foto de Galeria 06',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1510332981392-36692ea3a195?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    width: 2000,
    height: 2000,
    alt: 'Larissa Paschoalotto Foto de Galeria 07',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1510423579098-f47bf52b6764?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80',
    width: 1050,
    height: 700,
    alt: 'Larissa Paschoalotto Foto de Galeria 08',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1507513319174-e556268bb244?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    width: 634,
    height: 952,
    alt: 'Larissa Paschoalotto Foto de Galeria 09',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1547150492-da7ff1742941?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    width: 1050,
    height: 700,
    alt: 'Larissa Paschoalotto Foto de Galeria 10',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1514920735211-8c697444a248?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    width: 1050,
    height: 700,
    alt: 'Larissa Paschoalotto Foto de Galeria 11',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1531969179221-3946e6b5a5e7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80',
    width: 636,
    height: 954,
    alt: 'Larissa Paschoalotto Foto de Galeria 12',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1567266565245-c08dc046815f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    width: 1950,
    height: 1301,
    alt: 'Larissa Paschoalotto Foto de Galeria 13',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1499006619764-59e5b0c0e7ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1069&q=80',
    width: 1069,
    height: 695,
    alt: 'Larissa Paschoalotto Foto de Galeria 14',
    grow: 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1526716173434-a1b560f2065d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    width: 634,
    height: 951,
    alt: 'Larissa Paschoalotto Foto de Galeria 15',
    grow: 1,
  },
  {
    src: 'https://images.unsplash.com/photo-1524675376764-82b73db11cc1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
    width: 700,
    height: 875,
    alt: 'Larissa Paschoalotto Foto de Galeria 16',
    grow: 1,
  },
];

export default dummyGalery;

export function getGalery() {
  return dummyGalery;
}
