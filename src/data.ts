import virgenImage from './images/manualidades/virgen.jpg'
import sombreroImage from './images/manualidades/sombrero.png'
import portallavesImage from './images/manualidades/portallaves.png'
import portallavesAltImage from './images/manualidades/portallaves1.png'
import materaImage from './images/manualidades/matera.jpg'
import materaAltImage from './images/manualidades/matera2.png'
import logoHilosDeAmor from './images/manualidades/logoHilosdeAmor.png'

export type Product = {
  id: string
  name: string
  category: string
  description: string
  image: string
}

export const products: Product[] = [
  { id: 'virgen', name: 'Virgen decorativa', category: 'Arte religioso', description: 'Una pieza artesanal hecha para acompañar espacios especiales con calidez y detalle.', image: virgenImage },
  { id: 'sombrero', name: 'Sombrero pintado', category: 'Accesorios', description: 'Sombreros personalizados con diseños que representan cultura.', image: sombreroImage },
  { id: 'portallaves', name: 'Portallaves Tepeyac', category: 'Decoración', description: 'Diseño personalizado para darle estilo a tu hogar.', image: portallavesImage },
  { id: 'portallaves-2', name: 'Portallaves dulce hogar', category: 'Decoración', description: 'Detalles hechos a mano para darle personalidad a tus rincones.', image: portallavesAltImage },
  { id: 'matera', name: 'Matera artesanal', category: 'Hogar', description: 'Un detalle pequeño ideal para un presente.', image: materaImage },
  { id: 'matera-2', name: 'Matera colgante', category: 'Hogar', description: 'Un hogar especial para tus plantas, creado con paciencia y amor.', image: materaAltImage },
]

export const handmadeLogo = logoHilosDeAmor

export const profile = {
  heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1100&q=85',
  aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
}

export const services = [
  { name: 'Estilismo', description: 'Cortes, peinados y una propuesta que se adapta a tu manera de llevarte.', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=85' },
  { name: 'Maquillaje', description: 'Looks para celebrar, crear y sentirte cómoda frente a cualquier ocasión.', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=700&q=85' },
  { name: 'Cuidado capilar', description: 'Rituales pensados para devolverle intención, brillo y movimiento a tu cabello.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Coloración', description: 'Transforma tu apariencia con colores que resaltan tu estilo único.', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=85' },
  { name: 'Manicure y pedicure', description: 'El cuidado que tus manos y pies necesitan.', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=85' },
  { name: 'Cejas y pestañas', description: 'Extensión de pestañas, laminado de cejas y lifting de pestañas.', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=85' },
  { name: 'Hydrolips', description: 'Hidratación profunda para labios.', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=85' },
]

export const handmade = {
  description: 'Productos artesanales que promueven la producción local y la sostenibilidad, llevando calidez y dedicación en cada creación.',
  link: '#',
  items: [
    { title: products[0].name, image: products[0].image },
    { title: products[2].name, image: products[2].image },
    { title: products[4].name, image: products[4].image },
  ],
}

export const timeline = [
  { date: '[Fecha]', title: '[Formación o certificación por agregar]', description: 'Espacio reservado para una formación confirmada.' },
  { date: '[Fecha]', title: '[Experiencia profesional por agregar]', description: 'Espacio reservado para una experiencia confirmada.' },
  { date: 'Próximamente', title: 'Nuevos capítulos', description: 'La historia sigue escribiéndose.' },
]

export const gallery = [
  { title: 'Texturas / 01', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85' },
  { title: 'Ritual / 02', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=85' },
  { title: 'Detalle / 03', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=85' },
  { title: 'Forma / 04', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85' },
]
