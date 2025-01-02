'use client';
import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import Loading from './loading';
import { HiOutlineInformationCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import generateBuyerDeclarationPDF from '../../utils/generateBuyerDeclarationPDF';
import Link from 'next/link';

type FormInputs = {
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
  neighborhood: string;
  city: string;
  uf: string;
  signature_day: string;
  signature_month: string;
};

export default function BuyerDeclaration() {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      nationality: '',
      marital_status: '',
      profession: '',
      cpf: '',
      identity_register: '',
      issuing_authority: '',
      expedition_date: '',
      street_name: '',
      house_number: '',
      neighborhood: '',
      city: '',
      uf: '',
      signature_day: '1',
      signature_month: '',
    },
  });

  // Observando os valores de city e name para usar no formulário
  const cityValue = watch('city');
  const nameValue = watch('name');

  const onSubmit = (data: FormInputs) => {
    generateBuyerDeclarationPDF(data);
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
              <h2 className="font-semibold text-2xl">Declaração do(a) comprador(a)</h2>

              <div className="flex gap-1 items-center">
                <HiOutlineInformationCircle className="text-xl text-neutral-500"></HiOutlineInformationCircle>
                <p className="text-md text-neutral-500">Não se preocupe, os indicadores acima de cada campo não irão aparecer no documento final.</p>
              </div>

              <div className="flex gap-1 items-center">
                <HiOutlineInformationCircle className="text-xl text-neutral-500"></HiOutlineInformationCircle>
                <p className="text-md text-neutral-500">Os textos não serão cortados.</p>
              </div>                
            </div>

            <Suspense fallback={<Loading />}>
              <div className="flex flex-col gap-2 m-2">
                <form id="form" className="flex flex-col max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
                  <div className="py-20 px-28 border border-neutral-300 rounded-2xl">
                    <h3 className="text-lg font-bold italic underline text-center mb-4">DECLARAÇÃO</h3>

                    {/* Seção de preenchimento das informações do comprador */}
                    <div className="flex flex-wrap gap-y-1 justify-between items-end">
                      {/* Nome completo */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="name" className="text-sm text-neutral-500">Nome completo</label>
                          <input
                            {...register("name", { 
                              required: "Nome é obrigatório",
                              minLength: { value: 3, message: "Nome muito curto" }
                            })}
                            className={`w-40 px-2 border rounded-2xl truncate ${errors.name ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                          {/* {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>} */}
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Nacionalidade */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="nationality" className="text-sm text-neutral-500">Nacionalidade</label>
                          <input
                            {...register("nationality", { required: "Nacionalidade é obrigatória" })}
                            className={`w-24 px-2 border rounded-2xl truncate ${errors.nationality ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Estado civil */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="marital_status" className="text-sm text-neutral-500">Estado civil</label>
                          <input
                            {...register("marital_status", { 
                              required: "Estado civil é obrigatório",
                            })}
                            className={`w-20 px-2 border rounded-2xl truncate ${errors.marital_status ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Profissão */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="profession" className="text-sm text-neutral-500">Profissão</label>
                          <input
                            {...register("profession", { 
                              required: "Profissão é obrigatória",
                            })}
                            className={`w-28 px-2 border rounded-2xl truncate ${errors.profession ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Texto estático */}
                      <p className="pr-1">inscrito(a) no CPF sob nº</p>

                      {/* CPF */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="cpf" className="text-sm text-neutral-500">CPF</label>
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
                          {/* {errors.cpf && <span className="text-red-500 text-xs">{errors.cpf.message}</span>} */}
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Texto estático */}
                      <p className="pr-1">portador(a) da CDI nº</p>

                      {/* RG */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="identity_register" className="text-sm text-neutral-500">RG</label>
                          <input
                            {...register("identity_register", { 
                              required: "RG é obrigatório",
                              minLength: 10,
                            })}
                            className={`w-28 px-2 border rounded-2xl truncate ${errors.identity_register ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      <p className="px-1">-</p>

                      {/* Órgão emissor */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="issuing_authority" className="text-sm text-neutral-500">Órgão emissor</label>
                          <input
                            {...register("issuing_authority", { 
                              required: "Órgão emissor é obrigatório",
                            })}
                            placeholder="Ex: SSP/RS"
                            className={`w-28 px-2 border rounded-2xl truncate ${errors.issuing_authority ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Texto estático */}
                      <p className="pr-1">expedida em</p>

                      {/* Data de emissão */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="expedition_date" className="text-sm text-neutral-500">Data de emissão</label>
                          <input
                            type="date"
                            {...register("expedition_date", { 
                              required: "Data de emissão é obrigatória",
                            })}
                            className={`w-36 px-2 border rounded-2xl truncate ${errors.expedition_date ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Texto estático */}
                      <p className="pr-1">residente e domiciliado(a) na</p>

                      {/* Rua */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="street_name" className="text-sm text-neutral-500">Rua</label>
                          <input
                            {...register("street_name", { 
                              required: "Rua é obrigatória",
                            })}
                            className={`w-52 px-2 border rounded-2xl truncate ${errors.street_name ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Número da casa */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="house_number" className="text-sm text-neutral-500">Nº da casa</label>
                          <input
                            type="number"
                            min={0}
                            {...register("house_number", { 
                              required: "Número da casa é obrigatório",
                            })}
                            className={`w-20 px-2 border rounded-2xl truncate ${errors.house_number ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Texto estático */}
                      <p className="pr-1">bairro</p>

                      {/* Bairro */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="neighborhood" className="text-sm text-neutral-500">Bairro</label>
                          <input
                            {...register("neighborhood", { 
                              required: "Bairro é obrigatório",
                            })}
                            className={`w-32 px-2 border rounded-2xl truncate ${errors.neighborhood ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">,</p>
                      </div>

                      {/* Texto estático */}
                      <p className="pr-1">cidade de</p>

                      {/* Cidade */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="city" className="text-sm text-neutral-500">Cidade</label>
                          <input
                            {...register("city", { 
                              required: "Cidade é obrigatória",
                            })}
                            className={`w-32 px-2 border rounded-2xl truncate ${errors.city ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                          {/* {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>} */}
                        </div>

                        <p className="pr-1">,</p>
                        <p><b>declara</b>, sob as penas da Lei, que não</p> 
                      </div>

                      <div className="flex items-end text-justify">
                        <p className="pr-1">está obrigado(a) a apresentar a certidão Negativa da Receita Federal - prova de Inexistência de Débito e C.N.D. do INSS, por não ser empregador(a), não possuir firma em seu nome e também não ser exportador(a) de e nem vender produtos rurais diretamente no varejo, nos termos do que estabelece o decreto nº 3048 de 06 de Maio de 1999, decreto que aprova o Regulamento de Organização e do Custeio da Seguridade Social.</p>
                      </div>
                    </div>

                    {/* Seção de preenchimento do local e data de assinatura */}
                    <div className="flex justify-end items-end py-16">
                      {/* Cidade */}
                      <div className="flex items-end">
                        <input type="text" id="none" name="none" value={cityValue} disabled className="w-32 px-2 border border-neutral-500 rounded-2xl truncate text-center" />

                        <p>, (</p>
                      </div>

                      {/* UF */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="uf" className="text-sm text-neutral-500">UF</label>
                          <input
                            {...register("uf", { 
                              required: "UF é obrigatória",
                            })}
                            className={`w-12 px-2 border rounded-2xl truncate ${errors.uf ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>

                        <p className="pr-1">),</p>
                      </div>

                      {/* Dia */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="signature_day" className="text-sm text-neutral-500">Dia</label>
                          <input
                            type="number"
                            min={1}
                            max={31}
                            {...register("signature_day", { 
                              required: "Dia de assinatura é obrigatório",
                            })}
                            className={`w-16 px-2 border rounded-2xl truncate ${errors.signature_day ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>
                      </div>

                      {/* Texto estático */}
                      <p className="px-1">de</p>

                      {/* Mês e Ano */}
                      <div className="flex items-end">
                        <div className="flex flex-col">
                          <label htmlFor="signature_month" className="text-sm text-neutral-500">Mês e Ano</label>
                          <input
                            type="month"
                            {...register("signature_month", { 
                              required: "Mês e ano de assinatura são obrigatórios",
                            })}
                            className={`w-48 px-2 border rounded-2xl truncate ${errors.signature_month ? 'border-red-500' : 'border-neutral-500'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Seção de preenchimento do local e data de assinatura */}
                    <div className="flex flex-col gap-2 items-center">
                      <p className="w-80 border-b border-black"></p>

                      <input type="text" id="none" name="none" value={nameValue} disabled className="uppercase w-72 px-2 border border-neutral-500 rounded-2xl truncate text-center" />
                    </div>
                  </div>

                  {/* Erros */}
                  <div className="flex flex-col gap-1 mt-4">
                    {errors.name && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.name.message}</span>}
                    {errors.nationality && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.nationality.message}</span>}
                    {errors.marital_status && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.marital_status.message}</span>}
                    {errors.profession && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.profession.message}</span>}
                    {errors.cpf && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.cpf.message}</span>}
                    {errors.identity_register && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.identity_register.message}</span>}
                    {errors.issuing_authority && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.issuing_authority.message}</span>}
                    {errors.expedition_date && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.expedition_date.message}</span>}
                    {errors.street_name && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.street_name.message}</span>}
                    {errors.house_number && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.house_number.message}</span>}
                    {errors.neighborhood && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.neighborhood.message}</span>}
                    {errors.city && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.city.message}</span>}
                    {errors.uf && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.uf.message}</span>}
                    {errors.signature_day && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.signature_day.message}</span>}
                    {errors.signature_month && <span className="flex gap-1 items-center text-red-500 text-md"><HiOutlineExclamationTriangle className="text-2xl text-red-500"></HiOutlineExclamationTriangle> {errors.signature_month.message}</span>}
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
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
  