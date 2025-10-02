import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (
  title: string,
  data: any[],
  columns: { header: string; dataKey: string }[],
  additionalInfo?: { label: string; value: string }[]
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);
  
  // Additional info
  if (additionalInfo) {
    let yPos = 35;
    additionalInfo.forEach(info => {
      doc.text(`${info.label}: ${info.value}`, 14, yPos);
      yPos += 6;
    });
  }
  
  // Table
  autoTable(doc, {
    startY: additionalInfo ? 35 + (additionalInfo.length * 6) + 5 : 35,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey])),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (
  title: string,
  data: any[],
  sheetName: string = 'Reporte'
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportChartToPDF = (
  title: string,
  chartElement: HTMLElement,
  additionalData?: any[]
) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);
  
  // If there's additional data, add table
  if (additionalData && additionalData.length > 0) {
    autoTable(doc, {
      startY: 40,
      body: additionalData,
      theme: 'grid',
    });
  }
  
  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};
