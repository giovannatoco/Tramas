import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FavoritesProvider } from './components/FavoritesContext';
import { AppProvider } from './store/AppContext';
import AppLayout from './components/AppLayout';
import Welcome from './pages/Welcome';
import { Login, Register } from './pages/Auth';
import HomeBuyer from './pages/HomeBuyer';
import Explore from './pages/Explore';
import ArtisanProfile from './pages/ArtisanProfile';
import ProductDetail from './pages/ProductDetail';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import ProductForm from './pages/ProductForm';
import SellerOrders from './pages/SellerOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Assistant from './pages/Assistant';
import BrandEditor from './pages/BrandEditor';
import Chat from './pages/Chat';
import Commissions, { CommissionsList } from './pages/Commissions';
import CommissionForm from './pages/CommissionForm';
import Wallet from './pages/Wallet';
import Fairs from './pages/Fairs';
import FairsMap from './pages/FairsMap';
import PlaceholderPage from './pages/Placeholder';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route element={<AppLayout />}>
              <Route path="/inicio" element={<HomeBuyer />} />
              <Route path="/explorar" element={<Explore />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/artesana/:id" element={<ArtisanProfile />} />
              <Route path="/produtos/:id" element={<ProductDetail />} />
              <Route path="/sacola" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedidos" element={<Orders />} />
              <Route path="/encomendas" element={<Commissions />} />
              <Route path="/encomenda/nova" element={<CommissionForm />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/criar" element={<CreatePost />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/assistente" element={<Assistant />} />
              <Route path="/perfil-marca" element={<BrandEditor />} />
              <Route path="/carteira" element={<Wallet />} />
              <Route path="/feiras" element={<Fairs />} />
              <Route path="/mapa" element={<FairsMap />} />
              <Route path="/vender" element={<SellerDashboard />} />
              <Route path="/vender/produtos" element={<SellerProducts />} />
              <Route path="/vender/produtos/novo" element={<ProductForm />} />
              <Route path="/vender/produtos/:id" element={<ProductForm />} />
              <Route path="/vender/pedidos" element={<SellerOrders />} />
              <Route path="/vender/encomendas" element={<CommissionsList sellerView />} />
              <Route path="/vender/chat" element={<Chat sellerView />} />
              <Route path="/vender/chat/:id" element={<Chat sellerView />} />
              <Route
                path="/notificacoes"
                element={
                  <PlaceholderPage
                    title="Notificações"
                    description="Avisos sobre encomendas, mensagens e novidades do Tramas aparecerão aqui."
                  />
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <PlaceholderPage
                    title="Configurações"
                    description="Preferências da marca, notificações e acessibilidade serão configuráveis aqui."
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
