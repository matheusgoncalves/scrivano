import jsPDF from 'jspdf';

interface FormData {
  name: string;
  cpf: string;
  street_name: string;
  house_number: string;
  neighborhood: string;
  front: string;
  funds: string;
  right_side: string;
  left_side: string;
  terrain_total_area: string;
  terrain_transmitted_area: string;
  house_total_area: string;
  house_transmitted_area: string;
  construction_year: string;
  construction_material: string;
  contributor_name: string;
  contributor_cpf: string;
  own_resources: string;
  financing: string;
  total_value: string;
}

const generatePedroOsorioITBIPDF = async (formData: FormData) => {
  try {
    // Criando novo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configurando a fonte
    doc.setFont('times', 'normal');
    doc.setFontSize(11);

    // Adicionando imagem de fundo (frente)
    doc.addImage('/images/pedro_osorio_frente.png', 'PNG', 4, 0, 203, 145, undefined, 'FAST');

    // Exibindo informações do transmitente
    doc.text(formData.name, 70, 21);
    doc.text(formData.cpf, 109, 27);

    // Exibindo endereço
    const endereco = `${formData.street_name}, ${formData.house_number}, ${formData.neighborhood}`;
    doc.text(endereco, 70, 32);

    const formatNumber = (value: string) => {
      return value.replace('.', ',');
    };

    // Exibindo as dimensões do terreno
    doc.text(formatNumber(formData.front), 81, 60);
    doc.text(formatNumber(formData.funds), 81, 65);
    doc.text(formatNumber(formData.right_side), 127, 60);
    doc.text(formatNumber(formData.left_side), 127, 65);
    doc.text(formatNumber(formData.terrain_total_area), 177, 60);
    doc.text(formatNumber(formData.terrain_transmitted_area), 177, 65);

    // Exibindo as informações da construção
    doc.text(formatNumber(formData.house_total_area), 52, 82);
    doc.text(formatNumber(formData.house_transmitted_area), 52, 89);
    doc.text(formatNumber(formData.construction_year), 52, 96);

    // Definindo um tipo para as coordenadas
    type Coordinates = [number, number];

    // Definindo o objeto constructionTypes com tipagem adequada
    const constructionTypes: Record<string, Coordinates> = {
      'thin_masonry': [144.2, 76],
      'normal_masonry': [144.2, 82.5],
      'simple_masonry': [144.1, 89.2],
      'popular_masonry': [144.1, 95.6],
      'good_mixed': [171.2, 76.2],
      'normal_mixed': [171.6, 82.8],
      'simple_mixed': [171, 89.5],
      'popular_mixed': [171.1, 95.8],
      'good_wood': [197.8, 76.4],
      'normal_wood': [199.2, 83],
      'simple_wood': [199.5, 89.65],
      'popular_wood': [198.95, 96.05],
    };

    // Identificando a construção selecionada
    const selectedConstruction = formData.construction_material;

    // Obtendo as coordenadas do tipo selecionado
    if (constructionTypes[selectedConstruction]) {
      const [x, y] = constructionTypes[selectedConstruction];
      doc.text('X', x, y);
    }

    // Adicionando verso
    doc.addPage();
    doc.addImage('/images/pedro_osorio_verso.png', 'PNG', 4, 0, 203, 145, undefined, 'FAST');

    // Exibindo dados do contribuinte
    doc.text(formData.contributor_name, 50, 46);
    doc.text(formData.contributor_cpf, 95, 46);
    doc.text(endereco, 50, 56);

    doc.text(`R$ ${formData.own_resources}`, 86, 84.5);
    doc.text(`R$ ${formData.financing}`, 86, 90.5);
    doc.text(`R$ ${formData.total_value}`, 86, 96.5);    

    doc.save('ITBI_Pedro_Osorio.pdf');
    doc.save('ITBI_Pedro_Osorio.pdf');

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export default generatePedroOsorioITBIPDF;
