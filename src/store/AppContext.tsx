import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ARTISANS, PRODUCTS } from '../data/mock';
import type {
  BrandTheme,
  Commission,
  CommissionStatus,
  Conversation,
  PostComment,
  Product,
  User,
} from '../types';

export interface CartItem {
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  artisanId: string;
}

export type OrderStatus = 'aguardando' | 'confirmado' | 'em_producao' | 'enviado' | 'entregue';

export interface Order {
  id: string;
  buyerName: string;
  items: OrderItem[];
  total: number;
  address: string;
  payment: string;
  status: OrderStatus;
  createdAt: string;
  artisanId: string;
}

export interface Post {
  id: string;
  authorId: string;
  image: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  productId?: string;
  mediaType?: 'foto' | 'video';
}

interface AppState {
  // catálogo
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  checkout: (data: { buyerName: string; address: string; payment: string }) => Order;
  advanceOrderStatus: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => string;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // feed
  posts: Post[];
  savedPostIds: string[];
  postComments: Record<string, PostComment[]>;
  addPost: (post: { authorId: string; image: string; caption: string; tags: string[]; productId?: string }) => void;
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  // seguidores
  followedIds: string[];
  toggleFollow: (artisanId: string) => void;
  // marca
  getBrandTheme: (artisanId: string) => BrandTheme;
  saveBrandTheme: (artisanId: string, theme: BrandTheme) => void;
  resetBrandTheme: (artisanId: string) => void;
  // encomendas
  commissions: Commission[];
  addCommission: (data: Omit<Commission, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Commission;
  advanceCommission: (id: string) => void;
  sendCommissionProposal: (id: string, price: number, deadline: string) => void;
  approveCommission: (id: string) => void;
  cancelCommission: (id: string) => void;
  // chat
  conversations: Conversation[];
  ensureConversation: (artisanId: string, opts?: { productId?: string; productName?: string }) => string;
  sendChatMessage: (conversationId: string, from: 'comprador' | 'produtora', text: string) => void;
  markConversationRead: (conversationId: string) => void;
  unreadChatCount: number;
  // feiras
  reservedFairIds: string[];
  reserveFair: (fairId: string) => void;
  // autenticação (demonstrativa)
  users: User[];
  currentUser: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: { name: string; email: string; password: string; role: User['role']; brandName?: string; location?: string }) => { ok: boolean; error?: string };
  logout: () => void;
}

export type { BrandTheme, Commission, CommissionStatus, Conversation, PostComment, User } from '../types';

const AppContext = createContext<AppState | null>(null);

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Hash simples para demonstração — NÃO é seguro para produção.
function hashPassword(pw: string): string {
  let h = 5381;
  const s = `tramas::${pw}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return `demo-${h.toString(16)}`;
}

const SEED_USERS: User[] = [
  {
    id: 'u-buyer',
    name: 'Maria Compradora',
    email: 'maria@tramas.app',
    passHash: hashPassword('demo123'),
    role: 'comprador',
    location: 'Campinas/SP',
    createdAt: '2026-10-01',
  },
  {
    id: 'u-seller',
    name: 'Dona Nega',
    email: 'nega@casadanega.art',
    passHash: hashPassword('demo123'),
    role: 'produtora',
    brandName: 'Casa da Nega',
    location: 'Olinda/PE',
    createdAt: '2026-10-01',
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 'TRM-1042',
    buyerName: 'Carla Mendes',
    items: [
      { productId: 'p2', name: 'Colcha de crochê artesanal', price: 420, image: '/images/crochet-1.jpg', qty: 1, artisanId: 'a2' },
    ],
    total: 420,
    address: 'Rua das Flores, 120 — Jardim América, Campinas/SP',
    payment: 'Pix',
    status: 'em_producao',
    createdAt: '2026-11-20',
    artisanId: 'a2',
  },
  {
    id: 'TRM-1038',
    buyerName: 'João Pedro',
    items: [
      { productId: 'p3', name: 'Napperon de crochê em algodão', price: 64.9, image: '/images/renda-ponto-3.jpg', qty: 2, artisanId: 'a2' },
    ],
    total: 129.8,
    address: 'Av. Brasil, 800 — Centro, Campinas/SP',
    payment: 'Cartão de crédito',
    status: 'enviado',
    createdAt: '2026-11-18',
    artisanId: 'a2',
  },
];

const SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'a1',
    image: '/images/renda-bilro-1.jpg',
    caption: 'Preparando os bilros para o dia. A renda de bilro é feita de paciência — cada ponto conta uma história da minha avó. #rendadebilro #artesanato #feitoamao',
    tags: ['rendadebilro', 'artesanato', 'feitoamao'],
    likes: 342,
    comments: 28,
    createdAt: '2026-11-25',
    productId: 'p1',
  },
  {
    id: 'post-2',
    authorId: 'a5',
    image: '/images/ceramica-processo-2.jpg',
    caption: 'Modelando o vaso no torno. O barro vem da serra do Mar e cada peça sai única — nenhuma sai igual à outra. #ceramica #barro #atelie',
    tags: ['ceramica', 'barro', 'atelie'],
    likes: 518,
    comments: 41,
    createdAt: '2026-11-24',
    productId: 'p7',
  },
  {
    id: 'post-3',
    authorId: 'a2',
    image: '/images/knitting-wool-0.webp',
    caption: 'Mutirão de domingo na Casa da Nega: minha filha fia, eu crochêto e meu marido tinge o fio. Trabalho em família é o melhor remédio. #croche #familia #artesanato',
    tags: ['croche', 'familia', 'artesanato'],
    likes: 276,
    comments: 19,
    createdAt: '2026-11-22',
    productId: 'p2',
  },
  {
    id: 'post-4',
    authorId: 'a7',
    image: '/images/bordado-brasil-1.jpg',
    caption: 'Detalhe do bordado em seda natural. Cada peça da Modas do Vale é desenhada para quem vai usar — me conta o que você sonha? #modafeminina #bordado #encomenda',
    tags: ['modafeminina', 'bordado', 'encomenda'],
    likes: 489,
    comments: 52,
    createdAt: '2026-11-21',
    productId: 'p11',
  },
  {
    id: 'post-5',
    authorId: 'a6',
    image: '/images/couro-processo-1.jpg',
    caption: 'Corte manual do couro na bancada do ateliê. Três gerações de ofício — meu pai começou aqui em 1978. #couro #artesanato #tradicao',
    tags: ['couro', 'artesanato', 'tradicao'],
    likes: 391,
    comments: 33,
    createdAt: '2026-11-19',
    productId: 'p10',
  },
  {
    id: 'post-6',
    authorId: 'a4',
    image: '/images/bordado-arte-1.jpg',
    caption: 'Bordando uma lembrança de família. Quarenta anos de bastidor e cada peça ainda sai com o cheiro de memórias. #bordadolivre #seda #memoria',
    tags: ['bordadolivre', 'seda', 'memoria'],
    likes: 624,
    comments: 47,
    createdAt: '2026-11-17',
    productId: 'p6',
  },
];

const SEED_COMMISSIONS: Commission[] = [
  {
    id: 'ENC-201',
    artisanId: 'a2',
    buyerName: 'Carla Mendes',
    productId: 'p3',
    productName: 'Napperon de crochê em algodão',
    description: 'Gostaria de um jogo de 6 napperons em tons pastel para chá da tarde em família.',
    colors: 'Rosa, azul claro e cru',
    quantity: 6,
    deadline: '2026-12-20',
    budget: 'R$ 400',
    status: 'em_analise',
    createdAt: '2026-11-22',
    updatedAt: '2026-11-22',
  },
];

const ORDER_STATUS_FLOW: OrderStatus[] = ['aguardando', 'confirmado', 'em_producao', 'enviado', 'entregue'];
const COMMISSION_SELLER_FLOW: CommissionStatus[] = [
  'solicitacao',
  'em_analise',
  'proposta',
  'aguardando_aprovacao',
  'aprovada',
  'em_producao',
  'pronta_envio',
  'enviada',
  'concluida',
];

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  solicitacao: 'Solicitação enviada',
  em_analise: 'Em análise',
  proposta: 'Proposta enviada',
  aguardando_aprovacao: 'Aguardando aprovação',
  aprovada: 'Encomenda aprovada',
  em_producao: 'Em produção',
  pronta_envio: 'Pronta para envio',
  enviada: 'Enviada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const DEFAULT_THEME: Omit<BrandTheme, 'template'> = {
  primary: '#a33d18',
  secondary: '#4b2414',
  background: '#fff8ef',
  accent: '#e99b32',
  font: 'serifada',
};

export function defaultBrandTheme(artisanId: string): BrandTheme {
  const artisan = ARTISANS.find((a) => a.id === artisanId);
  return {
    template: 'artesanal',
    ...DEFAULT_THEME,
    primary: artisan?.color ?? DEFAULT_THEME.primary,
    techniques: artisan?.techniques,
    description: artisan?.story,
    cover: artisan?.cover,
    avatar: artisan?.avatar,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadJSON('tramas-products', PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => loadJSON('tramas-orders', SEED_ORDERS));
  const [posts, setPosts] = useState<Post[]>(() => loadJSON('tramas-posts', SEED_POSTS));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderSeq, setOrderSeq] = useState(1043);
  const [commissions, setCommissions] = useState<Commission[]>(() => loadJSON('tramas-commissions', SEED_COMMISSIONS));
  const [commissionSeq, setCommissionSeq] = useState(202);
  const [conversations, setConversations] = useState<Conversation[]>(() => loadJSON('tramas-chats', []));
  const [brandThemes, setBrandThemes] = useState<Record<string, BrandTheme>>(() => loadJSON('tramas-brands', {}));
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => loadJSON('tramas-saved-posts', []));
  const [postComments, setPostComments] = useState<Record<string, PostComment[]>>(() => loadJSON('tramas-post-comments', {}));
  const [followedIds, setFollowedIds] = useState<string[]>(() => loadJSON('tramas-following', []));
  const [reservedFairIds, setReservedFairIds] = useState<string[]>(() => loadJSON('tramas-fairs', []));
  const [users, setUsers] = useState<User[]>(() => loadJSON('tramas-users', SEED_USERS));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => loadJSON('tramas-user', null));
  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);

  // Persistência demonstrativa em localStorage
  useEffect(() => { localStorage.setItem('tramas-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('tramas-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('tramas-posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('tramas-commissions', JSON.stringify(commissions)); }, [commissions]);
  useEffect(() => { localStorage.setItem('tramas-chats', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem('tramas-brands', JSON.stringify(brandThemes)); }, [brandThemes]);
  useEffect(() => { localStorage.setItem('tramas-saved-posts', JSON.stringify(savedPostIds)); }, [savedPostIds]);
  useEffect(() => { localStorage.setItem('tramas-post-comments', JSON.stringify(postComments)); }, [postComments]);
  useEffect(() => { localStorage.setItem('tramas-following', JSON.stringify(followedIds)); }, [followedIds]);
  useEffect(() => { localStorage.setItem('tramas-fairs', JSON.stringify(reservedFairIds)); }, [reservedFairIds]);
  useEffect(() => { localStorage.setItem('tramas-users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('tramas-user', JSON.stringify(currentUserId)); }, [currentUserId]);

  // ---------- sacola ----------
  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { productId, qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setCartQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (products.find((p) => p.id === i.productId)?.price ?? 0) * i.qty, 0),
    [cart, products],
  );

  const checkout = useCallback(
    (data: { buyerName: string; address: string; payment: string }) => {
      const items: OrderItem[] = cart
        .map((i) => {
          const p = products.find((p) => p.id === i.productId);
          if (!p) return null;
          return { productId: p.id, name: p.name, price: p.price, image: p.image, qty: i.qty, artisanId: p.artisanId };
        })
        .filter((i): i is OrderItem => i !== null);

      const order: Order = {
        id: `TRM-${orderSeq}`,
        buyerName: data.buyerName,
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
        address: data.address,
        payment: data.payment,
        status: 'aguardando',
        createdAt: new Date().toISOString().slice(0, 10),
        artisanId: items[0]?.artisanId ?? '',
      };
      setOrderSeq((n) => n + 1);
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, products, orderSeq],
  );

  const advanceOrderStatus = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = ORDER_STATUS_FLOW.indexOf(o.status);
        return { ...o, status: ORDER_STATUS_FLOW[Math.min(idx + 1, ORDER_STATUS_FLOW.length - 1)] };
      }),
    );
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const id = `p-${Date.now()}`;
    setProducts((prev) => [...prev, { ...product, id }]);
    return id;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ---------- feed ----------
  const addPost = useCallback(
    (post: { authorId: string; image: string; caption: string; tags: string[]; productId?: string }) => {
      setPosts((prev) => [
        { ...post, id: `post-${Date.now()}`, likes: 0, comments: 0, createdAt: new Date().toISOString().slice(0, 10) },
        ...prev,
      ]);
    },
    [],
  );

  const togglePostLike = useCallback((postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
  }, []);

  const togglePostSave = useCallback((postId: string) => {
    setSavedPostIds((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  }, []);

  const addPostComment = useCallback((postId: string, text: string) => {
    const comment: PostComment = {
      id: `c-${Date.now()}`,
      author: 'Você',
      text: text.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPostComments((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), comment] }));
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)));
  }, []);

  // ---------- seguidores ----------
  const toggleFollow = useCallback((artisanId: string) => {
    setFollowedIds((prev) => (prev.includes(artisanId) ? prev.filter((id) => id !== artisanId) : [...prev, artisanId]));
  }, []);

  // ---------- marca ----------
  const getBrandTheme = useCallback(
    (artisanId: string): BrandTheme => ({ ...defaultBrandTheme(artisanId), ...(brandThemes[artisanId] ?? {}) }),
    [brandThemes],
  );

  const saveBrandTheme = useCallback((artisanId: string, theme: BrandTheme) => {
    setBrandThemes((prev) => ({ ...prev, [artisanId]: theme }));
  }, []);

  const resetBrandTheme = useCallback((artisanId: string) => {
    setBrandThemes((prev) => {
      const next = { ...prev };
      delete next[artisanId];
      return next;
    });
  }, []);

  // ---------- encomendas ----------
  const now = () => new Date().toISOString().slice(0, 10);

  const addCommission = useCallback(
    (data: Omit<Commission, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      const commission: Commission = {
        ...data,
        id: `ENC-${commissionSeq}`,
        status: 'solicitacao',
        createdAt: now(),
        updatedAt: now(),
      };
      setCommissionSeq((n) => n + 1);
      setCommissions((prev) => [commission, ...prev]);
      return commission;
    },
    [commissionSeq],
  );

  const patchCommission = useCallback((id: string, patch: Partial<Commission>) => {
    setCommissions((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c)));
  }, []);

  const advanceCommission = useCallback(
    (id: string) => {
      setCommissions((prev) =>
        prev.map((c) => {
          if (c.id !== id || c.status === 'cancelada' || c.status === 'concluida') return c;
          const idx = COMMISSION_SELLER_FLOW.indexOf(c.status);
          const next = COMMISSION_SELLER_FLOW[Math.min(idx + 1, COMMISSION_SELLER_FLOW.length - 1)];
          return { ...c, status: next, updatedAt: now() };
        }),
      );
    },
    [],
  );

  const sendCommissionProposal = useCallback(
    (id: string, price: number, deadline: string) => {
      patchCommission(id, { proposedPrice: price, proposedDeadline: deadline, status: 'aguardando_aprovacao' });
    },
    [patchCommission],
  );

  const approveCommission = useCallback(
    (id: string) => {
      patchCommission(id, { status: 'aprovada' });
    },
    [patchCommission],
  );

  const cancelCommission = useCallback(
    (id: string) => {
      patchCommission(id, { status: 'cancelada' });
    },
    [patchCommission],
  );

  // ---------- chat ----------
  const ensureConversation = useCallback(
    (artisanId: string, opts?: { productId?: string; productName?: string }) => {
      const existing = conversations.find((c) => c.artisanId === artisanId && (c.productId ?? '') === (opts?.productId ?? ''));
      if (existing) return existing.id;
      const id = `conv-${Date.now()}`;
      const conv: Conversation = {
        id,
        artisanId,
        productId: opts?.productId,
        productName: opts?.productName,
        buyerName: currentUser?.name ?? 'Você',
        messages: [],
        unread: 0,
        updatedAt: now(),
      };
      setConversations((prev) => [conv, ...prev]);
      return id;
    },
    [conversations, currentUser],
  );

  const sendChatMessage = useCallback(
    (conversationId: string, from: 'comprador' | 'produtora', text: string) => {
      const msg = { id: `m-${Date.now()}`, from, text: text.trim(), createdAt: new Date().toISOString() };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, msg], updatedAt: now(), unread: from === 'produtora' ? c.unread + 1 : c.unread }
            : c,
        ),
      );
    },
    [],
  );

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)));
  }, []);

  const unreadChatCount = useMemo(
    () => conversations.filter((c) => c.artisanId === SELLER_ID).reduce((s, c) => s + c.unread, 0),
    [conversations],
  );

  // ---------- feiras ----------
  const reserveFair = useCallback((fairId: string) => {
    setReservedFairIds((prev) => (prev.includes(fairId) ? prev : [...prev, fairId]));
  }, []);

  // ---------- autenticação (demonstrativa) ----------
  const login = useCallback(
    (email: string, password: string) => {
      const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) return { ok: false, error: 'E-mail não cadastrado. Crie uma conta para continuar.' };
      if (user.passHash !== hashPassword(password)) return { ok: false, error: 'Senha incorreta. Tente novamente.' };
      setCurrentUserId(user.id);
      return { ok: true };
    },
    [users],
  );

  const register = useCallback(
    (data: { name: string; email: string; password: string; role: User['role']; brandName?: string; location?: string }) => {
      const email = data.email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === email)) {
        return { ok: false, error: 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.' };
      }
      const user: User = {
        id: `u-${Date.now()}`,
        name: data.name.trim(),
        email,
        passHash: hashPassword(data.password),
        role: data.role,
        brandName: data.brandName?.trim() || undefined,
        location: data.location?.trim() || undefined,
        createdAt: now(),
      };
      setUsers((prev) => [...prev, user]);
      setCurrentUserId(user.id);
      return { ok: true };
    },
    [users],
  );

  const logout = useCallback(() => setCurrentUserId(null), []);

  const value = useMemo<AppState>(
    () => ({
      products,
      orders,
      cart,
      addToCart,
      removeFromCart,
      setCartQty,
      clearCart,
      cartCount,
      cartTotal,
      checkout,
      advanceOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      posts,
      savedPostIds,
      postComments,
      addPost,
      togglePostLike,
      togglePostSave,
      addPostComment,
      followedIds,
      toggleFollow,
      getBrandTheme,
      saveBrandTheme,
      resetBrandTheme,
      commissions,
      addCommission,
      advanceCommission,
      sendCommissionProposal,
      approveCommission,
      cancelCommission,
      conversations,
      ensureConversation,
      sendChatMessage,
      markConversationRead,
      unreadChatCount,
      reservedFairIds,
      reserveFair,
      users,
      currentUser,
      login,
      register,
      logout,
    }),
    [
      products, orders, cart, addToCart, removeFromCart, setCartQty, clearCart, cartCount, cartTotal,
      checkout, advanceOrderStatus, addProduct, updateProduct, deleteProduct,
      posts, savedPostIds, postComments, addPost, togglePostLike, togglePostSave, addPostComment,
      followedIds, toggleFollow, getBrandTheme, saveBrandTheme, resetBrandTheme,
      commissions, addCommission, advanceCommission, sendCommissionProposal, approveCommission, cancelCommission,
      conversations, ensureConversation, sendChatMessage, markConversationRead, unreadChatCount,
      reservedFairIds, reserveFair, users, currentUser, login, register, logout,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  aguardando: 'Aguardando confirmação',
  confirmado: 'Confirmado',
  em_producao: 'Em produção',
  enviado: 'Enviado',
  entregue: 'Entregue',
};

export const SELLER_ID = 'a2'; // Dona Nega — Casa da Nega

export function getArtisan(id: string) {
  return ARTISANS.find((a) => a.id === id);
}
