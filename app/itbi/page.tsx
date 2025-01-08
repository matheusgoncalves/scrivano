'use client';
import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import Loading from './loading';
import { HiOutlineInformationCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import generateITBIPDF from '../../utils/generateITBIPDF';
import Link from 'next/link';

type FormInputs = {
  name: string;
  cpf: string;
  street_name: string;
  house_number: string;
  neighborhood: string;
  property_register_city: string;
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
};

export default function ITBI() {
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors } 
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      cpf: '',
      street_name: '',
      house_number: '',
      neighborhood: '',
      property_register_city: '',
      front: '',
      funds: '',
      right_side: '',
      left_side: '',
      terrain_total_area: '',
      terrain_transmitted_area: '',
      house_total_area: '',
      house_transmitted_area: '',
      construction_year: '',
      construction_material: '',
      contributor_name: '',
      contributor_cpf: '',
      own_resources: '',
      financing: '',
      total_value: '',
    },
  });

  // Observando os valores de name, house_number e neighborhood para usar no formulário
  const streetNameValue = watch('street_name');
  const houseNumberValue = watch('house_number');
  const neighborhoodValue = watch('neighborhood');
  
  // Observando o valor de property_register_city
  const propertyRegisterCityValue = watch('property_register_city');
  const propertyRegisterCity = 
    propertyRegisterCityValue === 'pedro_osorio' ? 'Pedro Osório' :
    propertyRegisterCityValue === 'cerrito' ? 'Cerrito' :
  '';

  // Observando os valores
  const financing = watch("financing");
  const ownResources = watch("own_resources");

  // Função para converter uma entrada literal para números
  const parseCurrencyToNumber = (value: string): number => {
    if (!value) return 0;
  
    // Remove os pontos e substitui a vírgula por ponto
    const numericValue = value.replace(/\./g, '').replace(',', '.');
  
    return parseFloat(numericValue) || 0;
  };

  // Função para converter um valor para o padrão financeiro brasileiro
  const formatToCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value).replace('R$', '').trim();
  };  

  // Função para calcular o total_value de acordo com o own_resources e o financing
  React.useEffect(() => {
    const financingValue = financing ? parseCurrencyToNumber(financing) : 0;
    const ownResourcesValue = ownResources ? parseCurrencyToNumber(ownResources) : 0;
  
    if (!financing && !ownResources) {
      setValue("total_value", "");
    } else {
      const totalValue = financingValue + ownResourcesValue;
      setValue("total_value", formatToCurrency(totalValue));
      console.log({ financingValue, ownResourcesValue, totalValue });
    }
  }, [financing, ownResources, setValue]);    

  const onSubmit = (data: FormInputs) => {
    generateITBIPDF(data);
  };

  return (
    <div className="grid align-top">
      <div className="grid justify-items-center content-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="flex">
          <Link href={'/'} className="bg-black hover:bg-neutral-700 text-white duration-200 px-4 py-2 rounded-2xl">Voltar à página inicial</Link>
        </header>

        <main className="flex flex-col gap-8 sm:items-start">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <h2 className="font-semibold text-2xl">ITBI de Pedro Osório</h2>

              <div className="flex gap-1 items-center">
                <HiOutlineInformationCircle className="text-xl text-neutral-500"></HiOutlineInformationCircle>
                <p className="text-md text-neutral-500">Não se preocupe, os indicadores acima de cada campo não irão aparecer no documento final.</p>
              </div>

              <div className="flex gap-1 items-center">
                <HiOutlineInformationCircle className="text-xl text-neutral-500"></HiOutlineInformationCircle>
                <p className="text-md text-neutral-500">Os textos não serão cortados.</p>
              </div>

              <div className="flex gap-1 items-center">
                <HiOutlineInformationCircle className="text-xl text-neutral-500"></HiOutlineInformationCircle>
                <p className="text-md text-neutral-500">Você pode baixar o arquivo no final da página.</p>
              </div>
            </div>

            <Suspense fallback={<Loading />}>
              <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="p-4 border border-neutral-300 rounded-2xl">
                  <div className="relative w-[1100px] h-[640px] flex flex-col" style={{ backgroundImage: 'url(images/itbi_frente.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Frente da ITBI */}
                    <div className="flex flex-col">
                      {/* Transmitente */}
                      <div className="absolute left-64 top-[39px]">
                        <div className="flex flex-col">
                          <label htmlFor="name" className="sr-only">Nome completo</label>
                          <input
                            {...register("name", { 
                              required: "Nome é obrigatório",
                              minLength: { value: 3, message: "Nome muito curto" }
                            })}
                            placeholder="Machado de Assis"
                            className={`w-[480px] px-2 border rounded-2xl truncate ${errors.name ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>
                      </div>

                      {/* CPF */}
                      <div className="absolute left-[560px] top-[69px]">
                        <div className="flex flex-col">
                          <label htmlFor="cpf" className="sr-only">CPF</label>
                          <input
                            {...register("cpf", {
                              required: "CPF é obrigatório",
                              pattern: {
                                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                message: "CPF inválido (formato: XXX.XXX.XXX-XX)"
                              }
                            })}
                            placeholder="XXX.XXX.XXX-XX"
                            className={`w-36 px-2 border rounded-2xl truncate ${errors.cpf ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>
                      </div>

                      {/* Logradouro, número e complemento */}
                      <div className="absolute left-[340px] top-[96px]">
                        <div className="relative flex flex-col">
                          {/* Logradouro (nome da rua) */}
                          <div className="absolute flex flex-col">
                            <label htmlFor="street_name" className="sr-only">Logradouro</label>
                            <input
                              {...register("street_name", { 
                                required: "Rua é obrigatória",
                              })}
                              placeholder="Avenida Duque de Caxias, 7301"
                              className={`w-96 px-2 border rounded-2xl truncate ${errors.street_name ? 'border-red-500' : 'border-neutral-500'}`}
                            />
                          </div>

                          <div className="absolute top-[26px] flex">
                            {/* Número da casa */}
                            <div className="flex flex-col">
                              <label htmlFor="house_number" className="sr-only">Nº da casa</label>
                              <input
                                type="number"
                                min={0}
                                {...register("house_number", { 
                                  required: "Número da casa é obrigatório",
                                })}
                                placeholder="1000"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.house_number ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>

                            <p>,</p>

                            {/* Bairro */}
                            <div className="pl-3 flex flex-col">
                              <label htmlFor="neighborhood" className="sr-only">Bairro</label>
                              <input
                                placeholder="Centro"
                                {...register("neighborhood", { 
                                  required: "Bairro é obrigatório",
                                })}
                                className={`w-38 px-2 border border-neutral-500 rounded-2xl truncate`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cidade do Registro de Imóveis */}
                      <div className="absolute right-[268px] top-[180px]">
                        <div className="absolute flex flex-col">
                          <label htmlFor="property_register_city" className="sr-only">Cidade do Registro de Imóveis</label>
                          <select 
                            id="property_register_city"
                            {...register("property_register_city", { 
                              required: "Cidade do Registro de Imóveis é obrigatória",
                            })}
                            className={`w-52 px-2 border rounded-2xl truncate ${errors.property_register_city ? 'border-red-500' : 'border-neutral-500'}`}
                          >
                            <option value="">Selecione uma opção</option>
                            <option value="pedro_osorio">PEDRO OSÓRIO</option>
                            <option value="cerrito">Cerrito</option>
                          </select>
                        </div>
                      </div>

                      {/* Dimensões do terreno */}
                      <div className="absolute left-[388px] top-[234px]">
                        <div className="relative flex">
                          <div className="absolute flex flex-col gap-[1px]">
                            {/* Tamanho da frente do terreno */}
                            <div className="flex flex-col">
                              <label htmlFor="front" className="sr-only">Tamanho da frente do terreno</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("front", { 
                                  required: "Frente do terreno é obrigatório",
                                })}
                                placeholder="10,00"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.front ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>

                            {/* Tamanho dos fundos do terreno */}
                            <div className="absolute top-[26px] flex flex-col">
                              <label htmlFor="funds" className="sr-only">Tamanho dos fundos do terreno</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("funds", { 
                                  required: "Fundos do terreno é obrigatório",
                                })}
                                placeholder="10,00"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.funds ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>
                          </div>

                          <div className="absolute top-[1px] left-[260px] flex flex-col gap-[1px]">
                            {/* Tamanho do lado direito do terreno */}
                            <div className="flex flex-col">
                              <label htmlFor="right_side" className="sr-only">Lado direito do terreno</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("right_side", { 
                                  required: "Lado direito do terreno é obrigatório",
                                })}
                                placeholder="10,00"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.right_side ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>

                            {/* Tamanho do lado esquerdo do terreno */}
                            <div className="absolute top-[26px] flex flex-col">
                              <label htmlFor="left_side" className="sr-only">Tamanho do lado esquerdo do terreno</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("left_side", { 
                                  required: "Lado esquerdo do terreno é obrigatório",
                                })}
                                placeholder="10,00"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.left_side ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>
                          </div>

                          <div className="absolute top-[3px] left-[552px] flex flex-col gap-[1px]">
                            {/* Tamanho da área total do terreno */}
                            <div className="flex flex-col">
                              <label htmlFor="terrain_total_area" className="sr-only">Área total do terreno</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("terrain_total_area", { 
                                  required: "Área total do terreno é obrigatória",
                                })}
                                placeholder="10,00"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.terrain_total_area ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>

                            {/* Tamanho da área transmitida do terreno */}
                            <div className="absolute top-[26px] flex flex-col">
                              <label htmlFor="terrain_transmitted_area" className="sr-only">Área transmitida do terreno</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("terrain_transmitted_area", { 
                                  required: "Área transmitida do terreno é obrigatória",
                                })}
                                placeholder="10,00"
                                className={`w-20 px-2 border rounded-2xl truncate ${errors.terrain_transmitted_area ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Construções, beifeitorias e melhoramentos */}
                      <div className="absolute left-[251px] top-[346px]">
                        <div className="relative flex">
                          {/* Medidas da construção */}
                          <div className="relative flex-col">
                            {/* Tamanho da área total da casa */}
                            <div className="absolute flex flex-col">
                              <label htmlFor="house_total_area" className="sr-only">Área total da casa</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("house_total_area", { 
                                  required: "Área total da casa é obrigatória",
                                })}
                                placeholder="100,00"
                                className={`w-[84px] px-2 border rounded-2xl truncate ${errors.house_total_area ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>

                            {/* Tamanho da área transmitida da casa */}
                            <div className="absolute top-[33px] flex flex-col">
                              <label htmlFor="house_transmitted_area" className="sr-only">Área transmitida da casa</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                {...register("house_transmitted_area", { 
                                  required: "Área transmitida da casa é obrigatória",
                                })}
                                placeholder="100,00"
                                className={`w-[84px] px-2 border rounded-2xl truncate ${errors.house_transmitted_area ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>

                            {/* Ano da construção da casa */}
                            <div className="absolute top-[67px] flex flex-col">
                              <label htmlFor="construction_year" className="sr-only">Ano da construção da casa</label>
                              <input
                                type="number"
                                min={0}
                                {...register("construction_year", { 
                                  required: "Ano da construção da casa é obrigatório",
                                })}
                                placeholder="2002"
                                className={`w-[84px] px-2 border rounded-2xl truncate ${errors.construction_year ? 'border-red-500' : 'border-neutral-500'}`}
                              />
                            </div>
                          </div>

                          {/* Tipo da construção */}
                          <div className="absolute flex left-[509px] -top-[25px]">
                            {/* Tipo: Alvenaria */}
                            <div className="flex flex-col">
                              {/* Fina */}
                              <div className="absolute top-[4px] flex">
                                <label htmlFor="thin_masonry" className="sr-only">Fina</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="thin_masonry" 
                                    value="thin_masonry"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Normal */}
                              <div className="absolute top-[38px] flex flex-col">
                                <label htmlFor="normal_masonry" className="sr-only">Normal</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="normal_masonry" 
                                    value="normal_masonry"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Simples */}
                              <div className="absolute top-[71px] flex flex-col">
                                <label htmlFor="simple_masonry" className="sr-only">Simples</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="simple_masonry" 
                                    value="simple_masonry"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Popular */}
                              <div className="absolute top-[103px] flex flex-col">
                                <label htmlFor="popular_masonry" className="sr-only">Popular</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="popular_masonry" 
                                    value="popular_masonry"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Tipo: Mista */}
                            <div className="absolute top-[1px] left-[146px] flex flex-col">
                              {/* Bom */}
                              <div className="absolute top-[4px] flex">
                                <label htmlFor="good_mixed" className="sr-only">Boa</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="good_mixed" 
                                    value="good_mixed"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Normal */}
                              <div className="absolute top-[38px] left-[3px] flex flex-col">
                                <label htmlFor="normal_mixed" className="sr-only">Normal</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="normal_mixed" 
                                    value="normal_mixed"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Simples */}
                              <div className="absolute top-[72px] -left-[1px] flex flex-col">
                                <label htmlFor="simple_mixed" className="sr-only">Simples</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="simple_mixed" 
                                    value="simple_mixed"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Popular */}
                              <div className="absolute top-[103px] flex flex-col">
                                <label htmlFor="popular_mixed" className="sr-only">Popular</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="popular_mixed" 
                                    value="popular_mixed"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Tipo: Madeira */}
                            <div className="absolute left-[296px] top-[2px] flex flex-col">
                              {/* Bom */}
                              <div className="absolute top-[4px] -left-[6px] flex">
                                <label htmlFor="good_wood" className="sr-only">Boa</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="good_wood" 
                                    value="good_wood"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Normal */}
                              <div className="absolute top-[38px] left-[2px] flex flex-col">
                                <label htmlFor="normal_wood" className="sr-only">Normal</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="normal_wood" 
                                    value="normal_wood" 
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório", 
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Simples */}
                              <div className="absolute top-[71px] left-[4px] flex flex-col">
                                <label htmlFor="simple_wood" className="sr-only">Simples</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="simple_wood" 
                                    value="simple_wood"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })} 
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>

                              {/* Popular */}
                              <div className="absolute top-[104px] left-[1px] flex flex-col">
                                <label htmlFor="popular_wood" className="sr-only">Popular</label>

                                <div className="flex justify-center items-center w-3">
                                  <input 
                                    type="radio" 
                                    id="popular_wood" 
                                    value="popular_wood"
                                    {...register("construction_material", { 
                                      required: "Tipo da construção é obrigatório",
                                    })}
                                    className="appearance-none w-3 h-3 border border-neutral-500 cursor-pointer checked:mt-[2px] checked:w-2 checked:h-2 checked:ring-1 checked:ring-blue-500 checked:ring-offset-1 checked:border-transparent checked:bg-blue-500" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Erros */}
                <div className="flex flex-col gap-1 my-4">
                  {errors.name && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.name.message}</span>}
                  {errors.cpf && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.cpf.message}</span>}
                  {errors.street_name && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.street_name.message}</span>}
                  {errors.house_number && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.house_number.message}</span>}
                  {errors.neighborhood && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.neighborhood.message}</span>}
                  {errors.property_register_city && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.property_register_city.message}</span>}
                  {errors.front && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.front.message}</span>}
                  {errors.funds && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.funds.message}</span>}
                  {errors.right_side && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.right_side.message}</span>}
                  {errors.left_side && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.left_side.message}</span>}
                  {errors.terrain_total_area && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.terrain_total_area.message}</span>}
                  {errors.terrain_transmitted_area && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.terrain_transmitted_area.message}</span>}
                  {errors.house_total_area && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.house_total_area.message}</span>}
                  {errors.house_transmitted_area && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.house_transmitted_area.message}</span>}
                  {errors.construction_year && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.construction_year.message}</span>}
                  {errors.construction_material && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.construction_material.message}</span>}
                </div>

                <div className="p-4 border border-neutral-300 rounded-2xl">
                  <div className="relative w-[1100px] h-[640px] flex flex-col" style={{ backgroundImage: 'url(images/itbi_verso.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Verso da ITBI */}
                    <div className="flex flex-col">
                      {/* Cidade do Registro de Imóveis */}
                      <div className="absolute left-[210px] top-[78px]">
                        <div className="absolute font-extrabold text-lg flex whitespace-nowrap">
                          {propertyRegisterCity}
                        </div>
                      </div>

                      {/* Nome do contribuinte */}
                      <div className="absolute left-56 top-[166px]">
                        <div className="flex flex-col">
                          <label htmlFor="contributor_name" className="sr-only">Nome do contribuinte</label>
                          <input
                            {...register("contributor_name", { 
                              required: "Nome é obrigatório",
                              minLength: { value: 3, message: "Nome muito curto" }
                            })}
                            placeholder="Machado de Assis"
                            className={`w-[264px] px-2 border rounded-2xl truncate ${errors.contributor_name ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>
                      </div>

                      {/* CPF do contribuinte */}
                      <div className="absolute left-[500px] top-[166px]">
                        <div className="flex items-center gap-1">
                          <label htmlFor="contributor_cpf">CPF:</label>
                          <input
                            {...register("contributor_cpf", {
                              required: "CPF é obrigatório",
                              pattern: {
                                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                message: "CPF inválido (formato: XXX.XXX.XXX-XX)"
                              }
                            })}
                            placeholder="XXX.XXX.XXX-XX"
                            className={`w-36 px-2 border rounded-2xl truncate ${errors.contributor_cpf ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>
                      </div>

                      {/* Endereço do contribuinte */}
                      <div className="absolute left-[132px] top-[215px]">
                        <div className="relative flex items-center gap-1">
                          {/* Nome da rua */}
                          <div className="flex items-center">
                            <div className="flex flex-col">
                              <input type="text" id="none" name="none" value={streetNameValue} placeholder="Preenchimento automático" disabled className="w-72 px-2 border border-neutral-500 rounded-2xl truncate text-center" />
                            </div>

                            <p>,</p>
                          </div>

                          {/* Número da casa */}
                          <div className="flex">
                            <div className="flex items-center gap-1">
                              <input type="text" id="none" name="none" value={houseNumberValue} placeholder="Preenchimento automático" disabled className="w-20 px-2 border border-neutral-500 rounded-2xl truncate text-center" />
                            </div>

                            <p>,</p>
                          </div>

                          {/* Bairro */}
                          <div className="flex">
                            <div className="flex items-center gap-1">
                              <input type="text" id="none" name="none" value={neighborhoodValue} placeholder="Preenchimento automático" disabled className="w-40 px-2 border border-neutral-500 rounded-2xl truncate text-center" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute text-lg top-[360px] left-[424px] flex flex-col">
                        {/* Recursos próprios */}
                        <div className="flex items-center gap-2">
                          <p>R$</p>

                          <div className="flex flex-col">
                            <label htmlFor="own_resources" className="sr-only">Recursos próprios</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              {...register("own_resources", {
                                required: "Recursos próprios é obrigatório",
                              })}
                              placeholder="40.000,00"
                              className={`w-40 h-7 px-2 border rounded-2xl truncate ${errors.own_resources ? 'border-red-500' : 'border-neutral-500'}`}
                            />
                          </div>
                        </div>

                        {/* Financiamento */}
                        <div className="absolute top-[31px] flex items-center gap-2">
                          <p>R$</p>

                          <div className="flex flex-col">
                            <label htmlFor="financing" className="sr-only">Financiamento</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              {...register("financing", {
                                required: "Valor do financiamento é obrigatório",
                              })}
                              placeholder="88.500,00"
                              className={`w-40 h-7 px-2 border rounded-2xl truncate ${errors.financing ? 'border-red-500' : 'border-neutral-500'}`}
                            />
                          </div>
                        </div>

                        {/* Valor total (automático) */}
                        <div className="absolute top-[62px] flex items-center gap-2">
                          <p>R$</p>

                          <div className="flex flex-col">
                            <label htmlFor="total_value" className="sr-only">Valor total</label>
                            <input
                              type="text"
                              {...register("total_value", { 
                                required: "Valor total é obrigatório",
                              })}
                              disabled
                              placeholder="128.500,00"
                              className={`w-40 h-7 px-2 border rounded-2xl truncate ${errors.total_value ? 'border-red-500' : 'border-neutral-500'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Erros */}
                <div className="flex flex-col gap-1 mt-4">
                  {errors.contributor_name && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.contributor_name.message}</span>}
                  {errors.contributor_cpf && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.contributor_cpf.message}</span>}
                  {errors.own_resources && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.own_resources.message}</span>}
                  {errors.neighborhood && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.neighborhood.message}</span>}
                  {errors.financing && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.financing.message}</span>}
                  {errors.total_value && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.total_value.message}</span>}
                </div>

                {/* Botão de download */}
                <div className="relative flex flex-col mx-auto mt-8 gap-2 items-center w-fit">
                  <button type="submit" className="flex bg-blue-600 hover:bg-blue-700 duration-200 text-white px-4 py-2 rounded-2xl">
                    Baixar documento
                  </button>

                  <div className="flex gap-1">
                    <HiOutlineInformationCircle className="text-2xl text-neutral-500"></HiOutlineInformationCircle>
                    <p className="text-md text-neutral-500">Após clicar no botão, você pode encontrar o documento baixado no canto superior direito do navegador, ou na pasta Downloads.</p>
                  </div>
                </div>
              </form>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
