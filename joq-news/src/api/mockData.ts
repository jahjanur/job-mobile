/**
 * Mock data for offline UI development.
 * Varied Albanian news headlines across different categories
 * for a realistic feed experience.
 * Will be replaced by real WordPress API calls later.
 */

import type { AppCategory, AppPost } from './types';

// Local image reference — requires() are resolved at bundle time
export const MOCK_NEWS_IMAGE = require('../../assets/news-image.png');

const ARTICLE_CONTENT = `<p>Në vitet e fundit, Shqipëria ka dëshmuar një fenomen ekonomik që sfidon logjikën e tregut të lirë: ndërsa monedha europiane është zhvlerësuar ndjeshëm ndaj Lekut, çmimet e produkteve të importit në raftet e supermarketeve jo vetëm që nuk kanë rënë, por në shumë raste kanë pësuar rritje galopante. Sipas një analize të fundit, ky fenomen nuk është thjesht një pasojë e inflacionit global, por pasqyron një problematikë të thellë strukturore dhe mungesë të theksuar konkurrence në tregun tonë të vogël.</p>

<p>Në teori, kur monedha me të cilën blejmë mallrat jashtë vendit humbet vlerë, kostoja e blerjes për importuesin shqiptar ulet. Ky kursim duhet të reflektohet në çmimin final që paguan qytetari. Megjithatë, në praktikën shqiptare, ky zhvlerësim kalon pothuajse i padukshëm. Kjo ndodh sepse rrugëtimi i një produkti nga fabrika jashtë vendit deri në tryezën tonë nuk varet vetëm nga kursi i këmbimit. Importuesit dhe shitësit operojnë me marzhe të larta fitimi dhe shpesh aplikojnë atë që njihet si "premium rreziku", duke i mbajtur çmimet artificialisht të larta për t'u mbrojtur nga vonesat në logjistikë, taksat apo luhatjet e ardhshme politike.</p>

<blockquote><p>Problemi bëhet akoma më i mprehtë kur hyjmë në territorin e abuzimit real ekonomik.</p></blockquote>

<p>Analiza vëren se abuzimi fillon pikërisht aty ku diferenca midis çmimit në vendin e origjinës dhe atij në Shqipëri bëhet e pajustifikueshme. Për shembull, një produkt që në Itali shitet me pakicë për 1.00 euro, në Shqipëri mund të arrijë deri në 3.00 euro. Edhe nëse llogarisim kostot legjitime si transportin, doganën etj, të cilat për një ekonomi të vogël si jona mund ta rrisin çmimin me 40–60%, diferenca e mbetur prej më shumë se 1 euro nuk shpjegohet me asgjë tjetër përveç "rentes oligopolistike". Kjo do të thotë se një grup i vogël aktorësh që kontrollojnë importin, shfrytëzojnë fuqinë e tyre për të mbajtur çmime të larta, duke e lënë konsumatorin pa asnjë alternativë tjetër.</p>

<h2>Struktura e tregut shqiptar</h2>

<p>Një tjetër faktor që rëndon situatën është struktura e Shqipërisë si një treg me volume të ulëta. Duke qenë se tregtarët tanë nuk blejnë në sasi masive si në Gjermani apo Itali, ata humbasin përfitimet e "ekonomisë së shkallës", çka e bën koston e blerjes për njësi strukturalisht më të lartë. Por, kjo rritje strukturore shërben shpesh si një "vello" për të fshehur rritjet abuzive që shkojnë nga 120% deri në 200%. Në këtë mjedis, zhvlerësimi i euros nuk shkon për të lehtësuar qytetarin, por përfundon pothuajse tërësisht në xhepat e importuesve.</p>

<p>Për të dalë nga ky rreth vicioz, nuk mjafton vetëm forcimi i Lekut. Ulja reale e çmimeve do të kërkonte ndërhyrje të forta për hapjen e tregut dhe nxitjen e konkurrencës së vërtetë. Pa një funksionim efektiv të Autoritetit të Konkurrencës dhe pa një transparencë publike që u lejon qytetarëve të krahasojnë çmimet, Euro mund të vazhdojë të bjerë, por faturat e ushqimeve në Shqipëri do të vazhdojnë të mbeten ndër më të kripurat në rajon.</p>

<p><strong>FACT CHECK:</strong> Synimi i JOQ Albania është t'i paraqesë lajmet në mënyrë të saktë dhe të drejtë. Nëse ju shikoni diçka që nuk shkon, jeni të lutur të na e raportoni këtu.</p>`;

interface MockPostData {
  title: string;
  excerpt: string;
  categoryIds: number[];
  categoryNames: string[];
  authorName: string;
  date: string;
}

const MOCK_POST_VARIANTS: MockPostData[] = [
  {
    title: 'Paradoksi shqiptar: Euro bie, çmimet e ushqimeve rriten',
    excerpt: 'Në vitet e fundit, Shqipëria ka dëshmuar një fenomen ekonomik që sfidon logjikën e tregut të lirë.',
    categoryIds: [2],
    categoryNames: ['Lajme'],
    authorName: 'M Gjini',
    date: '2026-02-18T19:33:00',
  },
  {
    title: 'Shqipëria drejt anëtarësimit në BE: Çfarë pritet në 2027',
    excerpt: 'Procesi i integrimit europian po merr hapa konkretë me hapjen e kapitujve të rinj të negociatave.',
    categoryIds: [2],
    categoryNames: ['Lajme'],
    authorName: 'A Hoxha',
    date: '2026-02-18T17:15:00',
  },
  {
    title: 'Teknologjia 5G mbërrin në Shqipëri: Çfarë ndryshon për qytetarët',
    excerpt: 'Rrjeti i ri celular premton shpejtësi interneti deri në 100 herë më të shpejta se 4G aktual.',
    categoryIds: [3],
    categoryNames: ['Teknologji'],
    authorName: 'D Koci',
    date: '2026-02-18T14:20:00',
  },
  {
    title: 'Kombëtarja U-21 kualifikohet për Euro 2027 pas fitores historike',
    excerpt: 'Futbollistët e rinj shqiptarë shënuan fitore 3-1 në Beograd duke siguruar vendin e parë në grup.',
    categoryIds: [7],
    categoryNames: ['Sport'],
    authorName: 'E Sula',
    date: '2026-02-18T12:45:00',
  },
  {
    title: 'Riviera Shqiptare: Destinacioni i vitit sipas National Geographic',
    excerpt: 'Revista prestigjioze rendit bregdetin shqiptar mes 10 destinacioneve më të mira për 2026.',
    categoryIds: [4],
    categoryNames: ['Botë'],
    authorName: 'L Mato',
    date: '2026-02-17T22:00:00',
  },
  {
    title: 'Kosova nënshkruan marrëveshjen historike të bashkëpunimit rajonal',
    excerpt: 'Marrëveshja e re hap rrugën për tregti të lirë dhe bashkëpunim ekonomik midis vendeve të rajonit.',
    categoryIds: [9],
    categoryNames: ['Kosova'],
    authorName: 'S Vela',
    date: '2026-02-17T18:30:00',
  },
  {
    title: 'Festivali i filmit shqiptar nis nesër me 30 filma nga regjisorë të rinj',
    excerpt: 'Kinematografia shqiptare po përjeton një rilindije me një gjeneratë të re talentësh.',
    categoryIds: [5],
    categoryNames: ['Argëtim'],
    authorName: 'B Dervishi',
    date: '2026-02-17T15:10:00',
  },
  {
    title: 'Studim i ri: Shqiptarët mes popujve më optimistë në Ballkan',
    excerpt: 'Anketa ndërkombëtare tregon se 67% e shqiptarëve besojnë se jeta do të jetë më e mirë vitin e ardhshëm.',
    categoryIds: [1],
    categoryNames: ['Veç e Jona'],
    authorName: 'F Brahimi',
    date: '2026-02-17T11:00:00',
  },
  {
    title: 'Spitali i ri universitar gati për hapje: 800 shtretër dhe pajisje moderne',
    excerpt: 'Investimi prej 120 milionë eurosh premton transformimin e shërbimit shëndetësor në kryeqytet.',
    categoryIds: [14],
    categoryNames: ['Shëndetësi'],
    authorName: 'R Beqiri',
    date: '2026-02-16T20:45:00',
  },
  {
    title: 'Thashetheme: Çifti i njohur shqiptar konfirmon ndarjen',
    excerpt: 'Pas muajsh spekulimesh, dy personazhet e njohura të showbiz-it kanë bërë publike ndarjen.',
    categoryIds: [12],
    categoryNames: ['Thashetheme'],
    authorName: 'K Mema',
    date: '2026-02-16T16:20:00',
  },
  {
    title: 'Banka e Shqipërisë ul normat e interesit: Efektet në ekonomi',
    excerpt: 'Vendimi i fundit i bankës qendrore pritet të stimulojë kreditimin dhe investimet private.',
    categoryIds: [2],
    categoryNames: ['Lajme'],
    authorName: 'M Gjini',
    date: '2026-02-16T14:00:00',
  },
  {
    title: 'Zgjedhjet në Maqedoni: Partitë shqiptare në garën për pushtet',
    excerpt: 'Garës i bashkohen edhe kandidatë të pavarur në disa nga komunat më të mëdha.',
    categoryIds: [6],
    categoryNames: ['Maqedoni'],
    authorName: 'A Hoxha',
    date: '2026-02-16T10:30:00',
  },
  {
    title: 'Startup-et shqiptare tërheqin 50 milionë euro investime në 2025',
    excerpt: 'Sektori i teknologjisë po rritet me 40% çdo vit duke e kthyer Tiranën në hub rajonal inovacioni.',
    categoryIds: [3],
    categoryNames: ['Teknologji'],
    authorName: 'D Koci',
    date: '2026-02-15T19:15:00',
  },
  {
    title: 'Dieta mesdhetare: Pse Shqipëria ka një avantazh natyror shëndetësor',
    excerpt: 'Studiuesit thonë se tradita ushqimore shqiptare ofron mbrojtje ndaj sëmundjeve kronike.',
    categoryIds: [14],
    categoryNames: ['Shëndetësi'],
    authorName: 'R Beqiri',
    date: '2026-02-15T15:00:00',
  },
  {
    title: 'Superliga: Tirana fiton derbin e kryeqytetit me rezultat 2-0',
    excerpt: 'Ekipi bardh e blu siguroi tri pikë të rëndësishme në garën për titullin e kampionit.',
    categoryIds: [7],
    categoryNames: ['Sport'],
    authorName: 'E Sula',
    date: '2026-02-15T12:00:00',
  },
];

const VIEW_COUNTS = [
  4520, 3890, 2750, 2340, 1980, 1560, 1230, 980, 870, 650, 520, 410, 380, 290, 150,
];

function createMockPost(id: number): AppPost {
  const variant = MOCK_POST_VARIANTS[(id - 1) % MOCK_POST_VARIANTS.length];
  return {
    id,
    title: variant.title,
    excerpt: variant.excerpt,
    content: ARTICLE_CONTENT,
    slug: `post-${id}`,
    date: variant.date,
    modified: variant.date,
    authorName: variant.authorName,
    authorAvatar: null,
    featuredImage: null,
    featuredImageLarge: null,
    featuredImageAlt: variant.title,
    categoryIds: variant.categoryIds,
    categoryNames: variant.categoryNames,
    tagIds: [],
    viewCount: VIEW_COUNTS[(id - 1) % VIEW_COUNTS.length],
    link: `https://joq-albania.com/post-${id}`,
  };
}

/** 15 mock posts so we can populate the full feed UI */
export const MOCK_POSTS: AppPost[] = Array.from({ length: 15 }, (_, i) =>
  createMockPost(i + 1),
);

export const MOCK_CATEGORIES: AppCategory[] = [
  { id: 1, name: 'Veç e Jona', slug: 'vec-e-jona', count: 20, parentId: 0 },
  { id: 2, name: 'Lajme', slug: 'lajme', count: 45, parentId: 0 },
  { id: 3, name: 'Teknologji', slug: 'teknologji', count: 12, parentId: 0 },
  { id: 4, name: 'Botë', slug: 'bota', count: 18, parentId: 0 },
  { id: 5, name: 'Argëtim', slug: 'argetim', count: 25, parentId: 0 },
  { id: 6, name: 'Maqedoni', slug: 'maqedoni', count: 8, parentId: 0 },
  { id: 7, name: 'Sport', slug: 'sport', count: 30, parentId: 0 },
  { id: 8, name: 'Persekutimi ndaj JOQ', slug: 'persekutimi-ndaj-joq', count: 5, parentId: 0 },
  { id: 9, name: 'Kosova', slug: 'kosova', count: 15, parentId: 0 },
  { id: 10, name: 'Sondazhe', slug: 'sondazhe', count: 6, parentId: 0 },
  { id: 11, name: 'Kuriozitete', slug: 'kuriozitete', count: 10, parentId: 0 },
  { id: 12, name: 'Thashetheme', slug: 'thashetheme', count: 22, parentId: 0 },
  { id: 13, name: 'Udhëtime', slug: 'udhetime', count: 9, parentId: 0 },
  { id: 14, name: 'Shëndetësi', slug: 'shendeti', count: 11, parentId: 0 },
  { id: 15, name: 'Si të...', slug: 'si-te', count: 7, parentId: 0 },
  { id: 16, name: 'Live', slug: 'live', count: 3, parentId: 0 },
];
