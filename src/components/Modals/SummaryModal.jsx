import React, { useState } from 'react';
import { X, ClipboardList, ShoppingCart, Package, Printer } from 'lucide-react';

const SummaryModal = ({ isOpen, onClose, productionSummary, rawMaterialSummary }) => {
  const [view, setView] = useState('products'); // 'products' or 'materials'
  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    let contentHtml = '';
    if (view === 'products') {
      contentHtml = productionSummary.map(([item, count]) => `
        <div class="item">
          <span class="name">${item}</span>
          <span class="qty">x${count}</span>
        </div>
      `).join('');
    } else {
      contentHtml = rawMaterialSummary.map(([material, total]) => `
        <div class="item">
          <span class="name">${material}</span>
          <span class="qty">${total.toLocaleString()}</span>
        </div>
      `).join('');
    }

    const title = view === 'products' ? 'PLAN DE PRODUCCIÓN' : 'LISTA DE MATERIA PRIMA';

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 30px; color: #000; }
            h1 { text-align: center; border-bottom: 3px solid #000; padding-bottom: 15px; font-size: 32px; text-transform: uppercase; }
            .item { display: flex; justify-content: space-between; align-items: center; font-size: 24px; padding: 15px 0; border-bottom: 1px dashed #666; }
            .name { font-weight: bold; }
            .qty { font-size: 28px; font-weight: 900; background: #eee; padding: 5px 15px; border-radius: 10px; }
            .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #666; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div style="margin-top: 30px;">
            ${contentHtml || '<p style="text-align:center; font-size: 20px;">No hay items para mostrar.</p>'}
          </div>
          <div class="footer">
            Generado por Delicias de la Mami Yoyita
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="modal-blur no-print">
      <div className="modal-lux" style={{maxWidth: '600px'}}>
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px'}}>
          <h2 style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <ClipboardList size={28} color="#FF8DA1" /> 
            Plan de Producción
          </h2>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>

        <div style={{display: 'flex', gap: '10px', marginBottom: '25px', background: '#F1F5F9', padding: '5px', borderRadius: '15px'}}>
          <button 
            onClick={() => setView('products')}
            style={{
              flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: view === 'products' ? 'white' : 'transparent',
              fontWeight: '700', color: view === 'products' ? '#4A4A4A' : '#717171',
              boxShadow: view === 'products' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Package size={18} /> Producción / Cocina
          </button>
          <button 
            onClick={() => setView('materials')}
            style={{
              flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: view === 'materials' ? 'white' : 'transparent',
              fontWeight: '700', color: view === 'materials' ? '#4A4A4A' : '#717171',
              boxShadow: view === 'materials' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <ShoppingCart size={18} /> Materia Prima (Recetas)
          </button>
        </div>

        <div style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '5px'}}>
          {view === 'products' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {productionSummary.map(([item, count]) => (
                <div key={item} style={{display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#FFF5F7', borderRadius: '18px', border: '1px solid #FFE4E6'}}>
                  <span style={{fontWeight: '700', color: '#4A4A4A', fontSize: '18px'}}>{item}</span>
                  <span style={{fontWeight: '900', color: '#FF8DA1', fontSize: '22px'}}>x{count}</span>
                </div>
              ))}
              {productionSummary.length === 0 && <p style={{textAlign: 'center', color: '#717171', padding: '20px'}}>No hay ingredientes cargados para producción.</p>}
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{background: '#F0FDFA', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid #CCFBF1'}}>
                <p style={{margin: 0, fontSize: '13px', color: '#0D9488', fontWeight: '700'}}>💡 Basado en recetas estándar antiguas. (Opcional si usas el campo de ingredientes)</p>
              </div>
              {rawMaterialSummary.map(([material, total]) => (
                <div key={material} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: 'white', borderRadius: '15px', border: '1px solid #E2E8F0'}}>
                  <span style={{fontWeight: '600', color: '#4A4A4A'}}>{material}</span>
                  <span style={{fontWeight: '800', color: '#0D9488'}}>{total.toLocaleString()}</span>
                </div>
              ))}
              {rawMaterialSummary.length === 0 && <p style={{textAlign: 'center', color: '#717171', padding: '20px'}}>No hay materia prima calculada.</p>}
            </div>
          )}
        </div>

        <button 
          className="btn-main" 
          style={{width: '100%', marginTop: '25px', justifyContent: 'center', background: '#0F766E'}}
          onClick={handlePrint}
        >
          <Printer size={20} />
          Imprimir Formato Cocina
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
