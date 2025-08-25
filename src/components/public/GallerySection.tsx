import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react';
import Modal from '../common/Modal';

const galleryImages = [
  {
    id: 1,
    url: 'https://i.imgur.com/sJGTbHT.png',
    title: 'Pista principal',
    description: 'Vista panorámica de nuestro circuito cubierto de 330m²'
  },
  {
    id: 2,
    url: 'https://scontent.fros8-1.fna.fbcdn.net/v/t1.6435-9/71744610_2407813242627965_8529066418560303104_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=eVqkWQE0h50Q7kNvwHRwzQB&_nc_oc=AdnAW9-blx-JLZtJ2fMGvv6lCMobkdmXXuotah14NBCaxR8ruPTbpAJLxfE4J0J1Tok&_nc_zt=23&_nc_ht=scontent.fros8-1.fna&_nc_gid=789LqMKtUe4fKuOJ7AA_LQ&oh=00_AfX4GfYEr2F2VEw5yFSzW3qJULzPvNOkLvrIK0bISgvF4g&oe=68D2F9C0',
    title: 'Karts profesionales',
    description: 'Flota de 8 karts mantenidos diariamente'
  },
  {
    id: 3,
    url: 'https://scontent.fros8-1.fna.fbcdn.net/v/t39.30808-6/474733716_1074526884475287_7292196122953941809_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=NgvGJxuuhA4Q7kNvwHdxJeC&_nc_oc=Adl6kvUpOSukq4IWsVnnk8mfUqiVT0Tvx_oCVuPjyxawItf_8NPzu1qylqmnwkNuY8o&_nc_zt=23&_nc_ht=scontent.fros8-1.fna&_nc_gid=O3V_IhJSAvATjVz4uxPyjw&oh=00_AfXUBM88lerJNI_ncPvp3blCOsC4ENtRM9nMpLeLIp-47w&oe=68B176FD',
    title: 'Cronometraje computarizado',
    description: 'Sistema de timing profesional en tiempo real'
  },
  {
    id: 4,
    url: 'https://scontent.fros8-1.fna.fbcdn.net/v/t39.30808-6/474227269_1074527161141926_6204129546425465561_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ASkaiJiVsC4Q7kNvwH8Z2rR&_nc_oc=AdkzWq_Vuhnv0HaW-nlk_lVSG_PrFjmxXCAu8MbYaxTGovN94PbV7R-1DgZs9RNcicg&_nc_zt=23&_nc_ht=scontent.fros8-1.fna&_nc_gid=xzpq2w3wnG5X4DYkVhug_Q&oh=00_AfUBPXZuCgKhRATPgVbwarI3D4e9ltYNmAU1IJy4SQPReA&oe=68B16CF3',
    title: 'Área de espera',
    description: 'Zona cómoda para spectadores con buffet'
  },
  {
    id: 5,
    url: 'https://scontent.fros8-1.fna.fbcdn.net/v/t1.6435-9/72688687_2407813375961285_6501224483364274176_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=V2g2pxZ36GYQ7kNvwHdjvkn&_nc_oc=Adlh0tA_EXDKTIPrZyQY4cQpSU_xtpP6FmNVOHi0ohxuJcZTzqVta6D3Sh-mARp33Ak&_nc_zt=23&_nc_ht=scontent.fros8-1.fna&_nc_gid=NjlmDhFV-91T8CQZWeLCeQ&oh=00_AfXexMppH3yNRC61Va7NKSeqxs2TIFZQWJ44NHBs0akL3g&oe=68D31110',
    title: 'Diversión garantizada',
    description: 'Veni a divertirte con tus amigo al mejor Indoor Kart de la ciudad'
  },
];

const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const openModal = (index: number) => {
    setSelectedImage(index);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="galeria" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Conocé nuestras <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">instalaciones</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Un vistazo a la experiencia que te espera en el karting cubierto más moderno de Rosario
          </p>
        </div>

        {/* Main Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => openModal(index)}
            >
              <div className="aspect-square md:aspect-auto md:h-full">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-200 hidden md:block">{image.description}</p>
                  </div>
                </div>
              </div>

              {/* Image counter for main image */}
              {index === 0 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  1 / {galleryImages.length}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">🏁</div>
            <h3 className="text-xl font-bold text-white mb-2">Pista Cubierta</h3>
            <p className="text-gray-300">330m² de pura adrenalina, funcionamos con cualquier clima</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold text-white mb-2">Cronometraje Pro</h3>
            <p className="text-gray-300">Sistema computarizado que registra cada vuelta en tiempo real</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">☕</div>
            <h3 className="text-xl font-bold text-white mb-2">Área de Descanso</h3>
            <p className="text-gray-300">Buffet y zona cómoda para acompañantes y espectadores</p>
          </div>
        </div>

        {/* Virtual Tour CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Querés conocer más?
            </h3>
            <p className="text-red-100 mb-6">
              Visitanos y conocé nuestras instalaciones en persona
            </p>
            <a
              href={`https://wa.me/5493416188143?text=¡Hola! Quiero conocer las instalaciones`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>Consultá por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={selectedImage !== null}
        onClose={closeModal}
        size="xl"
      >
        {selectedImage !== null && (
          <div className="relative">
            <img
              src={galleryImages[currentIndex].url}
              alt={galleryImages[currentIndex].title}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            
            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-1">{galleryImages[currentIndex].title}</h3>
              <p className="text-gray-200">{galleryImages[currentIndex].description}</p>
              <div className="mt-2 text-sm text-gray-300">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default GallerySection;