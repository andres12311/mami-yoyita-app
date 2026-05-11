import { useMemo } from 'react';
import { recipes, productToRecipe } from '../data/recipes';

export const useStats = (pedidos, displayPedidos, selectedDate, produccionManual, gastosDetalle) => {
  const deliveryStats = useMemo(() => {
    const stats = {};
    displayPedidos.forEach(p => {
      if (p.movil) {
        if (!stats[p.movil]) stats[p.movil] = { count: 0, totalPay: 0 };
        stats[p.movil].count += 1;
        stats[p.movil].totalPay += (parseFloat(p.precioDomicilio) || 0);
      }
    });
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  }, [displayPedidos]);

  const productStats = useMemo(() => {
    const stats = {};
    displayPedidos.forEach(p => {
      const name = p.Pedido || 'Sin Nombre';
      stats[name] = (stats[name] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [displayPedidos]);

  const productionSummary = useMemo(() => {
    const summary = {};
    displayPedidos.forEach(p => {
      const name = p.Pedido || '';
      // Intentar limpiar el nombre (ej: "2 x Genovesas" -> "Genovesa")
      let cleanName = name.replace(/^\d+\s*[xX]?\s*/, '').trim();
      if (cleanName.endsWith('s')) cleanName = cleanName.slice(0, -1); // Plural simple
      
      const normalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      if (normalized) {
        summary[normalized] = (summary[normalized] || 0) + 1;
      }
    });

    const manual = produccionManual[selectedDate] || [];
    const finalTable = { ...summary };
    manual.forEach(m => {
      if (m.item) {
        finalTable[m.item] = (finalTable[m.item] || 0) + (parseInt(m.extra) || 0);
      }
    });

    return Object.entries(finalTable).sort((a, b) => b[1] - a[1]);
  }, [displayPedidos, produccionManual, selectedDate]);

  // NUEVO: Cálculo de materia prima total (Ingredientes base)
  const rawMaterialSummary = useMemo(() => {
    const materials = {};
    
    productionSummary.forEach(([product, quantity]) => {
      const recipeKey = productToRecipe[product];
      const recipe = recipes[recipeKey];
      
      if (recipe) {
        recipe.forEach(ing => {
          const key = `${ing.item} (${ing.unit})`;
          if (!materials[key]) materials[key] = 0;
          materials[key] += ing.amount * quantity;
        });
      }
    });
    
    return Object.entries(materials).sort((a, b) => b[1] - a[1]);
  }, [productionSummary]);

  const totalVentasDia = displayPedidos.reduce((sum, p) => sum + (parseFloat(p.precioDesayuno) || 0), 0);
  const totalGastosDia = (gastosDetalle[selectedDate] || []).reduce((sum, g) => sum + (parseFloat(g.monto) || 0), 0);
  const utilidadDia = totalVentasDia - totalGastosDia;

  // Global Stats (All time)
  const globalStats = useMemo(() => {
    const totalSales = pedidos.reduce((sum, p) => sum + (parseFloat(p.precioDesayuno) || 0), 0);
    const totalExpenses = Object.entries(gastosDetalle).reduce((sum, [key, list]) => {
      if (!Array.isArray(list)) return sum;
      return sum + list.reduce((s, g) => s + (parseFloat(g.monto) || 0), 0);
    }, 0);
    return {
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses
    };
  }, [pedidos, gastosDetalle]);

  // Monthly Stats (Breakdown by Month)
  const monthlyStats = useMemo(() => {
    const months = {};
    
    // Process Sales
    pedidos.forEach(p => {
      const date = p.fechaEntrega || '';
      if (date && date.includes('-')) {
        const monthKey = date.substring(0, 7); // YYYY-MM
        if (!months[monthKey]) months[monthKey] = { sales: 0, expenses: 0 };
        months[monthKey].sales += (parseFloat(p.precioDesayuno) || 0);
      }
    });

    // Process Expenses
    Object.entries(gastosDetalle).forEach(([date, list]) => {
      if (Array.isArray(list) && date.includes('-')) {
        const monthKey = date.substring(0, 7);
        if (!months[monthKey]) months[monthKey] = { sales: 0, expenses: 0 };
        months[monthKey].expenses += list.reduce((sum, g) => sum + (parseFloat(g.monto) || 0), 0);
      }
    });

    return Object.entries(months)
      .sort((a, b) => b[0].localeCompare(a[0])) // Most recent month first
      .map(([month, data]) => ({
        month,
        ...data,
        profit: data.sales - data.expenses
      }));
  }, [pedidos, gastosDetalle]);

  return { 
    deliveryStats, 
    productStats, 
    productionSummary, 
    rawMaterialSummary, 
    totalVentasDia, 
    totalGastosDia, 
    utilidadDia,
    globalStats,
    monthlyStats
  };
};
