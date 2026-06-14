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
    
    // Ya NO agregamos p.Pedido a la producción, por petición del usuario.
    // Solo se "stackeará" lo que se ponga en el nuevo campo de ingredientes.

    const manual = produccionManual[selectedDate] || [];
    const finalTable = { ...summary };
    manual.forEach(m => {
      if (m.item) {
        finalTable[m.item] = (finalTable[m.item] || 0) + (parseInt(m.extra) || 0);
      }
    });

    // Agregar los ingredientes extra de cada pedido a la tabla final de producción
    displayPedidos.forEach(p => {
      if (p.ingredientesProduccion) {
        const extras = p.ingredientesProduccion.split(',').map(s => s.trim()).filter(s => s.length > 0);
        extras.forEach(extra => {
          const normalizedExtra = extra.charAt(0).toUpperCase() + extra.slice(1).toLowerCase();
          finalTable[normalizedExtra] = (finalTable[normalizedExtra] || 0) + 1;
        });
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
