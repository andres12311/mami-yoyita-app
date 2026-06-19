import React, { useState, useMemo, useEffect } from 'react';
import { Heart, ShoppingBag, MessageCircle, Loader2, ChefHat, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['Todos', 'Desayunos', 'Tortas y Cupcakes', 'Mama 2026 💝', 'Extra'];

const formatPrice = (precio) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

const buildWhatsAppUrl = (config, productoNombre) => {
  const phone = config?.whatsapp || '3106305616';
  const mensaje = config?.mensaje || 'Hola, me gustaría pedir: ';
  return `https://wa.me/57${phone}?text=${encodeURIComponent(mensaje + productoNombre)}`;
};

/* ───────── Subcomponents ───────── */

const ImagePlaceholder = () => (
  <div
    style={{
      width: '100%',
      aspectRatio: '1 / 1',
      background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #f3e5f5 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: '16px 16px 0 0',
    }}
  >
    <ChefHat size={48} color="#d4a0b0" strokeWidth={1.5} />
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, color: '#c48b9f', fontWeight: 600 }}>
      Imagen próximamente
    </span>
  </div>
);

const ProductModal = ({ producto, config, onClose }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const imagenes = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes 
    : (producto.imagen ? [producto.imagen] : []);

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % imagenes.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'fadeIn 0.3s ease forwards'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 24, width: '100%', maxWidth: 480,
          maxHeight: '90vh', overflowY: 'auto', position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.85)',
            border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <X size={20} color="#3d2c3e" />
        </button>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', backgroundColor: '#f8f9fa', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
          {imagenes.length > 0 ? (
            <img src={imagenes[currentImageIdx]} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
          ) : (
            <ImagePlaceholder />
          )}

          {imagenes.length > 1 && (
            <>
              <button onClick={prevImg} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <ChevronLeft size={22} color="#3d2c3e" />
              </button>
              <button onClick={nextImg} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <ChevronRight size={22} color="#3d2c3e" />
              </button>
              <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
                {imagenes.map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === currentImageIdx ? '#c0547a' : 'rgba(255,255,255,0.8)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)', transition: 'background 0.3s' }} />
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ padding: '24px' }}>
          {producto.categoria && (
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "'Quicksand', sans-serif", background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)', color: '#ad5c7a', marginBottom: 12, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              {producto.categoria}
            </span>
          )}
          
          <h2 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, fontFamily: "'Quicksand', sans-serif", color: '#3d2c3e', lineHeight: 1.2 }}>
            {producto.nombre}
          </h2>

          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Quicksand', sans-serif", color: '#c0547a', letterSpacing: -0.5, marginBottom: 16 }}>
            {formatPrice(producto.precio)}
          </div>

          {producto.descripcion && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#3d2c3e', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Descripción</h4>
              <p style={{ margin: 0, fontSize: 15, fontFamily: "'Quicksand', sans-serif", color: '#6a5a6b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {producto.descripcion}
              </p>
            </div>
          )}

          <a href={buildWhatsAppUrl(config, producto.nombre)} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '16px', borderRadius: 30,
              background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', fontSize: 16, fontWeight: 700,
              fontFamily: "'Quicksand', sans-serif", textDecoration: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.25s ease', boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)'
            }}>
            <MessageCircle size={22} /> Pedir ahora
          </a>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ producto, config, index, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imagenes = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes 
    : (producto.imagen ? [producto.imagen] : []);

  return (
    <div
      className="catalog-card"
      style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: hovered
          ? '0 16px 40px rgba(216, 120, 150, 0.25)'
          : '0 4px 20px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
        animation: `fadeInUp 0.5s ease ${index * 0.07}s both`,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Gallery */}
      {imagenes.length > 0 && !imgError ? (
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            aspectRatio: '1 / 1',
          }}>
            {imagenes.map((imgUrl, i) => (
              <img
                key={i}
                src={imgUrl}
                alt={`${producto.nombre} ${i + 1}`}
                loading="lazy"
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  transition: 'transform 0.4s ease',
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          {/* Indicadores de galería */}
          {imagenes.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '0', right: '0',
              display: 'flex', justifyContent: 'center', gap: '6px',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              {imagenes.map((_, i) => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <ImagePlaceholder />
      )}

      {/* Content */}
      <div style={{ padding: '16px 18px 18px' }}>
        {/* Category badge */}
        {producto.categoria && (
          <span
            className="category-badge"
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'Quicksand', sans-serif",
              background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
              color: '#ad5c7a',
              marginBottom: 8,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}
          >
            {producto.categoria}
          </span>
        )}

        {/* Name */}
        <h3
          style={{
            margin: '0 0 6px',
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "'Quicksand', sans-serif",
            color: '#3d2c3e',
            lineHeight: 1.3,
          }}
        >
          {producto.nombre}
        </h3>

        {/* Description */}
        {producto.descripcion && (
          <p
            style={{
              margin: '0 0 12px',
              fontSize: 13.5,
              fontFamily: "'Quicksand', sans-serif",
              color: '#8a7b8e',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {producto.descripcion}
          </p>
        )}

        {/* Price + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginTop: 4,
          }}
        >
          <span
            className="price"
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: "'Quicksand', sans-serif",
              color: '#c0547a',
              letterSpacing: -0.3,
            }}
          >
            {formatPrice(producto.precio)}
          </span>

          <a
            href={buildWhatsAppUrl(config, producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 24,
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: "'Quicksand', sans-serif",
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 3px 12px rgba(37, 211, 102, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            <MessageCircle size={14} />
            Pedir
          </a>
        </div>
      </div>
    </div>
  );
};

/* ───────── Main Component ───────── */

const PublicCatalog = ({
  productos = [],
  catalogConfig = {},
  loading = false,
}) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const config = {
    whatsapp: catalogConfig.whatsapp || '3106305616',
    nombreTienda: catalogConfig.nombreTienda || 'Delicias de la Mami Yoyita',
    mensaje: catalogConfig.mensaje || 'Hola, me gustaría pedir: ',
  };

  const activeProducts = useMemo(
    () => [...productos]
      .filter((p) => p.activo !== false)
      .sort((a, b) => (a.orden || 0) - (b.orden || 0)),
    [productos]
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return activeProducts;
    return activeProducts.filter(
      (p) => p.categoria?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeProducts, activeCategory]);

  /* ── Render ── */
  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 6px 28px rgba(37,211,102,0.55); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #FFF5F7 0%, #FFFBFD 40%, #F9F4FB 100%)',
          fontFamily: "'Quicksand', sans-serif",
          overflowX: 'hidden',
        }}
      >
        {/* ═══════════ HERO ═══════════ */}
        <header
          style={{
            background: 'linear-gradient(135deg, #FF8DA1 0%, #E8B4CB 50%, #F3E8FF 100%)',
            padding: '48px 20px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              left: -20,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: '12%',
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />

          {/* Heart icon */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
              marginBottom: 16,
              animation: 'heartbeat 2s ease-in-out infinite',
            }}
          >
            <Heart size={32} color="#fff" fill="#fff" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Satisfy', cursive",
              fontSize: 'clamp(32px, 7vw, 52px)',
              color: '#fff',
              margin: '0 0 6px',
              textShadow: '0 2px 12px rgba(180, 80, 110, 0.3)',
              lineHeight: 1.2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {config.nombreTienda}
          </h1>

          {/* Subtitle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(6px)',
              padding: '8px 20px',
              borderRadius: 30,
              marginTop: 10,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Sparkles size={16} color="#fff" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                fontFamily: "'Quicksand', sans-serif",
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Catálogo de Productos
            </span>
            <Sparkles size={16} color="#fff" />
          </div>
        </header>

        {/* ═══════════ CATEGORY FILTER ═══════════ */}
        {!loading && activeProducts.length > 0 && (
          <nav
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 20,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(232, 180, 203, 0.2)',
              padding: '14px 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 10,
                overflowX: 'auto',
                padding: '0 20px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      flex: '0 0 auto',
                      padding: '9px 22px',
                      borderRadius: 28,
                      border: isActive ? 'none' : '1.5px solid #e8c8d8',
                      background: isActive
                        ? 'linear-gradient(135deg, #FF8DA1, #E8B4CB)'
                        : '#fff',
                      color: isActive ? '#fff' : '#9b7a8e',
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 13.5,
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive
                        ? '0 4px 14px rgba(255, 141, 161, 0.35)'
                        : '0 1px 4px rgba(0,0,0,0.04)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* ═══════════ CONTENT ═══════════ */}
        <main
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '28px 16px 40px',
          }}
        >
          {/* Loading state */}
          {loading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 20px',
                gap: 18,
                animation: 'fadeInUp 0.5s ease both',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF8DA1, #E8B4CB)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 24px rgba(255, 141, 161, 0.3)',
                }}
              >
                <Loader2
                  size={30}
                  color="#fff"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 16,
                  color: '#b5909e',
                  fontWeight: 600,
                }}
              >
                Cargando delicias...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredProducts.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 20px',
                gap: 16,
                animation: 'fadeInUp 0.5s ease both',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <ShoppingBag size={36} color="#d4a0b0" strokeWidth={1.5} />
              </div>
              <p
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 18,
                  color: '#a88b9a',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.6,
                }}
              >
                Pronto tendremos nuestro catálogo listo 🌸
              </p>
            </div>
          )}

          {/* Product grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="catalog-grid">
              {filteredProducts.map((producto, idx) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  config={config}
                  index={idx}
                  onClick={() => setSelectedProduct(producto)}
                />
              ))}
            </div>
          )}
        </main>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer
          style={{
            textAlign: 'center',
            padding: '32px 20px 36px',
            borderTop: '1px solid rgba(232, 180, 203, 0.2)',
            background: 'linear-gradient(180deg, transparent, rgba(252, 228, 236, 0.3))',
          }}
        >
          <Heart
            size={18}
            color="#e8a0b8"
            fill="#e8a0b8"
            style={{ marginBottom: 8 }}
          />
          <p
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 13,
              color: '#b5909e',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            © 2026 {config.nombreTienda} • Hecho con 💖
          </p>
        </footer>

        {/* ═══════════ FLOATING WHATSAPP BUTTON ═══════════ */}
        <a
          href={`https://wa.me/57${config.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contáctanos por WhatsApp"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            zIndex: 50,
            textDecoration: 'none',
            animation: 'pulse 2.5s ease-in-out infinite',
            transition: 'transform 0.2s ease',
          }}
        >
          <MessageCircle size={28} color="#fff" fill="#fff" />
        </a>

        {/* Modal de Detalles */}
        {selectedProduct && (
          <ProductModal 
            producto={selectedProduct} 
            config={config} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </div>
    </>
  );
};

export default PublicCatalog;
