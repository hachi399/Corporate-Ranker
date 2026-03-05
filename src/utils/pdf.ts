import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { CompanyScore, EVALUATION_ITEMS } from '../types';

export async function generatePDF(companies: CompanyScore[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Company Evaluation Ranking', 14, 22);
  
  const allItems = [...EVALUATION_ITEMS.front, ...EVALUATION_ITEMS.back];
  
  for (let index = 0; index < companies.length; index++) {
    const company = companies[index];
    if (index > 0) doc.addPage();
    
    doc.setFontSize(16);
    doc.text(`${index + 1}. ${company.raw.englishName || company.name}`, 14, 40);
    doc.setFontSize(12);
    doc.text(`Total Score: ${company.total} / 65`, 14, 48);

    // Capture Chart
    const chartElement = document.getElementById(`chart-${index}`);
    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
          onclone: (clonedDoc) => {
            // Remove all style and link tags to avoid oklch parsing errors
            const styles = clonedDoc.getElementsByTagName('style');
            for (let i = styles.length - 1; i >= 0; i--) {
              styles[i].remove();
            }
            const links = clonedDoc.getElementsByTagName('link');
            for (let i = links.length - 1; i >= 0; i--) {
              if (links[i].rel === 'stylesheet') {
                links[i].remove();
              }
            }

            const clonedElement = clonedDoc.getElementById(`chart-${index}`);
            if (clonedElement) {
              clonedElement.style.width = '450px';
              clonedElement.style.height = '300px';
              clonedElement.style.display = 'block';
              clonedElement.style.visibility = 'visible';
              clonedElement.style.backgroundColor = '#f8fafc';
              clonedElement.style.borderRadius = '24px';
              clonedElement.style.padding = '16px';
            }
          }
        });
        const imgData = canvas.toDataURL('image/png');
        // Add chart image to PDF
        doc.addImage(imgData, 'PNG', 14, 55, 60, 45);
      } catch (err) {
        console.error('Failed to capture chart', err);
      }
    }
    
    const tableData = allItems.map(item => [
      (item as any).englishLabel || item.label,
      company.scores[item.id],
      company.raw[item.id as keyof typeof company.raw]
    ]);
    
    autoTable(doc, {
      startY: 100, // Move table down to make room for chart
      head: [['Metric', 'Score (1-5)', 'Raw Value']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] }
    });
  }
  
  doc.save('company-ranking.pdf');
}
