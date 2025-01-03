'use client';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface FormData {
  name: string;
  nationality: string;
  marital_status: string;
  profession: string;
  cpf: string;
  identity_register: string;
  issuing_authority: string;
  expedition_date: string;
  street_name: string;
  house_number: string;
  city: string;
  uf: string;
  signature_day: string;
  signature_month: string;
}

const formatExpeditionDate = (dateString: string) => {
  // Adicionando o fuso horário UTC para evitar ajustes automáticos
  const date = new Date(dateString + 'T00:00:00Z');
  // Ajustando para considerar o fuso local na formatação
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};

const formatSignatureDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString + '-01T00:00:00Z');
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  return `${meses[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
};

const generateBuyerDeclarationPDF = async (formData: FormData) => {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);

  const expeditionDate = formData.expedition_date ? 
    formatExpeditionDate(formData.expedition_date) : '';
  
  const signatureDate = formData.signature_month ? 
    formatSignatureDate(formData.signature_month) : '';

  // Aumentando o tamanho base para melhor qualidade
  tempDiv.innerHTML = `
    <div id="pdf-content" style="width: 420mm; padding: 60mm; font-family: Times New Roman; font-size: 24pt; line-height: 1.5;">
      <h1 style="text-align: center; font-size: 24pt; font-style: italic; font-weight: bold; text-decoration: underline; margin-bottom: 40px;">
        DECLARAÇÃO
      </h1>
      
      <p style="text-align: justify; margin: 0;">
        ${formData.name}, ${formData.nationality}, ${formData.marital_status}, ${formData.profession}, 
        inscrito(a) no CPF sob nº ${formData.cpf}, portador(a) da CDI nº ${formData.identity_register} - 
        ${formData.issuing_authority}, expedida em ${expeditionDate}, residente e domiciliado(a) na 
        ${formData.street_name}, ${formData.house_number}, cidade de 
        ${formData.city}, <span style="margin-right: 9px;"><strong>declara</span></strong>, sob as penas da Lei, que o imóvel que está adquirindo, casa residencial objeto da matrícula é sua primeira aquisição imobiliária para fins residenciais. Declaração com base no art. 12-H da Consolidação Normativa Notarial e Registral da Corregedoria-Geral da Justiça do Estado do Rio Grande do Sul, que diz:
      </p>

      <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 20px;">
        <p style="text-align: justify; text-indent: 48px; margin: 0;">
          &quotART. 12-H – OS EMOLUMENTOS DEVIDOS PELOS ATOS RELACIONADOS COM A PRIMEIRA AQUISIÇÃO IMOBILIÁRIA PARA FINS RESIDENCIAIS FINANCIADA PELO SISTEMA FINANCEIRO DE HABITAÇÃO, DEVEM TER REDUÇÃO DE 50%, DE ACORDO COM A DISCIPLINA LEGAL DA MATÉRIA (ART. 290 DA LEI 6015/73).
        </p>

        <p style="text-align: justify; margin: 0;">
          §1º - O DESCONTO DO CAPUT APLICA-SE, INCLUSIVE, ÀS AVERBAÇÕES DAS EDIFICAÇÕES DECORRENTES DO FINANCIAMENTO E AOS CANCELAMENTOS DAS RESPECTIVAS GARANTIAS FIDUCIÁRIAS OU HIPOTECÁRIAS.&quot
        </p>
      </div>

      <div style="margin-top: 120px; text-align: right;">
        ${formData.city} (${formData.uf}), ${formData.signature_day} de ${signatureDate}.
      </div>

      <div style="margin-top: 120px; text-align: center;">
        <div style="text-transform: uppercase; border-top: 1px solid black; width: 640px; margin: 0 auto; padding-top: 4px;">
          ${formData.name}
        </div>
      </div>
    </div>
  `;

  try {
    // Configurações otimizadas do html2canvas
    const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
      scale: 4, // Aumentando a escala para melhor qualidade
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      windowWidth: 2480, // Aproximadamente A4 em 300 DPI
      windowHeight: 3508,
      onclone: (clonedDoc) => {
        // Garantindo que as fontes sejam carregadas no clone
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'Times New Roman';
            font-style: normal;
            font-weight: normal;
            src: local('Times New Roman');
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    // Configurações otimizadas do PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      hotfixes: ["px_scaling"]
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const aspectRatio = canvas.width / canvas.height;
    let imgWidth = pdfWidth;
    let imgHeight = pdfWidth / aspectRatio;

    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = imgHeight * aspectRatio;
    }

    const x = (pdfWidth - imgWidth) / 2;
    const y = 0;

    // Adicionando a imagem com qualidade melhorada
    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(`declaracao-comprador-${formData.name.split(' ')[0].toLowerCase()}.pdf`);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export default generateBuyerDeclarationPDF;
