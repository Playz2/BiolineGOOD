async function initializeQuestions() {
  const questions = [
  {
    question: "Care este cel mai mic os din corpul uman?",
    options: [
      "Scărița din urechea internă",
      "Falanga degetului mic",
      "Osul nazal",
      "Vertebra C1"
    ],
    correctAnswer: "Scărița din urechea internă",
    category: "sistemul osos"
  },
  {
    question: "Ce tip de os are aproximativ aceleași trei dimensiuni?",
    options: [
      "Osul lung",
      "Osul lat",
      "Osul scurt",
      "Osul sesamoid"
    ],
    correctAnswer: "Osul scurt",
    category: "sistemul osos"
  },
  {
    question: "Care proces stă la baza formării oaselor la om?",
    options: [
      "Osteogeneză",
      "Fotosinteză",
      "Respirație",
      "Excreție"
    ],
    correctAnswer: "Osteogeneză",
    category: "sistemul osos"
  },
  {
    question: "Unde se găsește măduva roșie în oasele adulte?",
    options: [
      "În diafiza femurului",
      "În epifiza oaselor lungi",
      "În periost",
      "În cavitățile interosoase"
    ],
    correctAnswer: "În epifiza oaselor lungi",
    category: "sistemul osos"
  },
  {
    question: "Ce formă de articulație nu permite mișcare?",
    options: [
      "Sinartroza",
      "Anfiartroza",
      "Diartroza",
      "Sincondroza"
    ],
    correctAnswer: "Sinartroza",
    category: "sistemul osos"
  },
  {
    question: "Ce element structural al articulației mobile produce lichid sinovial?",
    options: [
      "Membrana sinovială",
      "Capsula articulară",
      "Ligamentele",
      "Cartilajul hialin"
    ],
    correctAnswer: "Membrana sinovială",
    category: "sistemul osos"
  },
  {
    question: "Care este numele osului care poartă creierul?",
    options: [
      "Craniul",
      "Mandibula",
      "Vomerul",
      "Osul temporal"
    ],
    correctAnswer: "Craniul",
    category: "sistemul osos"
  },
  {
    question: "Ce tip de os se afla in palmă și tălpi?",
    options: [
      "Osul scurt",
      "Osul lung",
      "Osul plat",
      "Osul sesamoid"
    ],
    correctAnswer: "Osul scurt",
    category: "sistemul osos"
  },
  {
    question: "Care sunt curburile fiziologice ale coloanei vertebrale în plan sagittal?",
    options: [
      "Cifoze și lordoze",
      "Scolioze și convexoze",
      "Concavoze și convexoze",
      "Sinartroze și diartroze"
    ],
    correctAnswer: "Cifoze și lordoze",
    category: "sistemul osos"
  },
  {
    question: "Cum se numește țesutul care acoperă suprafața osoasă externă?",
    options: [
      "Periost",
      "Endost",
      "Cartilaj articular",
      "Maduva osoasă"
    ],
    correctAnswer: "Periost",
    category: "sistemul osos"
  },
  {
    question: "Ce celule sintetizează matricea osoasă organică?",
    options: [
      "Osteoblaste",
      "Osteoclaste",
      "Osteocite",
      "Condrocite"
    ],
    correctAnswer: "Osteoblaste",
    category: "sistemul osos"
  },
  {
    question: "Care este componenta inorganică principală a osului?",
    options: [
      "Hidroxiapatita",
      "Substanța fundamentală",
      "Fibra de colagen",
      "Acid hialuronic"
    ],
    correctAnswer: "Hidroxiapatita",
    category: "sistemul osos"
  },
  {
    question: "Ce rol principal au oasele în organism?",
    options: [
      "Susținere și protecție",
      "Digestie",
      "Transmitere nervoasă",
      "Filtrarea sângelui"
    ],
    correctAnswer: "Susținere și protecție",
    category: "sistemul osos"
  },
  {
    question: "Care os articolat permite mișcări de rotație a capului?",
    options: [
      "Vertebra C1",
      "Vertebra T1",
      "Osul occipital",
      "Mandibula"
    ],
    correctAnswer: "Vertebra C1",
    category: "sistemul osos"
  },
  {
    question: "Ce structuri leagă oasele între ele?",
    options: [
      "Ligamente",
      "Mușchi",
      "Tendoane",
      "Vene"
    ],
    correctAnswer: "Ligamente",
    category: "sistemul osos"
  },
  {
    question: "Cum se numește osul pieptului?",
    options: [
      "Sternul",
      "Clavicula",
      "Scapula",
      "Horario"
    ],
    correctAnswer: "Sternul",
    category: "sistemul osos"
  },
  {
    question: "Care mușchi este responsabil pentru expresiile faciale?",
    options: [
      "Mușchii mimici",
      "Mușchiul maseter",
      "Mușchiul trapez",
      "Mușchiul deltoid"
    ],
    correctAnswer: "Mușchii mimici",
    category: "sistemul muscular"
  },
  {
    question: "Ce mușchi ridică membrul superior deasupra orizontalei (abducție)?",
    options: [
      "Deltoid",
      "Biceps brahial",
      "Triceps brahial",
      "Pectoral mare"
    ],
    correctAnswer: "Deltoid",
    category: "sistemul muscular"
  },
  {
    question: "Care este cea mai lungă fibră musculară scheletică din corp?",
    options: [
      "Mușchiul sartorius",
      "Cvadricepsul",
      "Bicepsul femural",
      "Mușchiul gastrocnemian"
    ],
    correctAnswer: "Mușchiul sartorius",
    category: "sistemul muscular"
  },
  {
    question: "Ce tip de mușchi este mușchiul inimii?",
    options: [
      "Mușchi cardiac",
      "Mușchi striat scheletic",
      "Mușchi neted",
      "Mușchi mimetic"
    ],
    correctAnswer: "Mușchi cardiac",
    category: "sistemul muscular"
  },
  {
    question: "Care mușchi se află în peretele posterior al coapsei?",
    options: [
      "Biceps femural",
      "Cvadriceps femural",
      "Adductor mare",
      "Iliopsoas"
    ],
    correctAnswer: "Biceps femural",
    category: "sistemul muscular"
  },
  {
    question: "Ce reprezintă sarcomerul în miofibrilă?",
    options: [
      "Unitatea morfofuncțională",
      "Striația A",
      "Discul Z",
      "Fibra de colagen"
    ],
    correctAnswer: "Unitatea morfofuncțională",
    category: "sistemul muscular"
  },
  {
    question: "Tonusul muscular este definit ca:",
    options: [
      "O stare de tensiune permanentă",
      "O contracție totală",
      "Relaxare completă",
      "Inactivitate permanentă"
    ],
    correctAnswer: "O stare de tensiune permanentă",
    category: "sistemul muscular"
  },
  {
    question: "Ce mușchi scade în volum în urma denervării?",
    options: [
      "Mușchiul scheletic",
      "Mușchiul cardiac",
      "Mușchiul neted",
      "Mușchiul mimetic"
    ],
    correctAnswer: "Mușchiul scheletic",
    category: "sistemul muscular"
  },
  {
    question: "Care mușchi contribuie la flexia antebrațului?",
    options: [
      "Biceps brahial",
      "Triceps brahial",
      "Deltoid",
      "Pectoral mare"
    ],
    correctAnswer: "Biceps brahial",
    category: "sistemul muscular"
  },
  {
    question: "Ce structură conectează mușchiul de os?",
    options: [
      "Tendon",
      "Ligament",
      "Cartilaj",
      "Fascia"
    ],
    correctAnswer: "Tendon",
    category: "sistemul muscular"
  },
  {
    question: "În ce strat se află endomisiumul?",
    options: [
      "În jurul fibrei musculare individuale",
      "Între fascicule",
      "În jurul întregului mușchi",
      "În spațiul sinovial"
    ],
    correctAnswer: "În jurul fibrei musculare individuale",
    category: "sistemul muscular"
  },
  {
    question: "Ce mușchi separă cavitatea toracică de cea abdominală?",
    options: [
      "Diafragma",
      "Transvers al abdomenului",
      "Oblic extern",
      "Rectus abdominis"
    ],
    correctAnswer: "Diafragma",
    category: "sistemul muscular"
  },
  {
    question: "Care mușchi se află între coaste și asistă la respirație?",
    options: [
      "Mușchii intercostali",
      "Pectoral mare",
      "Trapez",
      "Latissimus dorsi"
    ],
    correctAnswer: "Mușchii intercostali",
    category: "sistemul muscular"
  },
  {
    question: "Cum se numește procesul de formare a țesutului muscular?",
    options: [
      "Miofibrilogeneză",
      "Osteogeneză",
      "Condrogeneză",
      "Hematopoieză"
    ],
    correctAnswer: "Miofibrilogeneză",
    category: "sistemul muscular"
  },
  {
    question: "Ce mușchi se găsește în profunzimea toracelui?",
    options: [
      "Subclavicular",
      "Pectoral mare",
      "Oblic extern",
      "Piramidal abdominal"
    ],
    correctAnswer: "Subclavicular",
    category: "sistemul muscular"
  },
  {
    question: "Ce tip de articulație este umărul (cea mai mobilă)?",
    options: [
      "Diartroză",
      "Sinartroză",
      "Anfiartroză",
      "Sincondroză"
    ],
    correctAnswer: "Diartroză",
    category: "sistemul osos"
  },
  {
    question: "Care os periferic asigură protecție plămânilor?",
    options: [
      "Coastele",
      "Clavicula",
      "Scapula",
      "Sternul"
    ],
    correctAnswer: "Coastele",
    category: "sistemul osos"
  },
  {
    question: "Ce os al craniului este impar și median?",
    options: [
      "Frontal",
      "Parietal",
      "Temporal",
      "Occipital"
    ],
    correctAnswer: "Frontal",
    category: "sistemul osos"
  },
  {
    question: "Ce rol are periostul?",
    options: [
      "Producția de celule osoase și nutritie",
      "Transmiterea impulsurilor nervoase",
      "Întinderea mușchilor",
      "Formarea cartilajului"
    ],
    correctAnswer: "Producția de celule osoase și nutritie",
    category: "sistemul osos"
  },
  {
    question: "Care este osul lung al membrului inferior?",
    options: [
      "Femur",
      "Tibia",
      "Peroneu",
      "Femur și tibia"
    ],
    correctAnswer: "Femur",
    category: "sistemul osos"
  },
  {
    question: "Ce mușchi se activează la ridicarea umerilor?",
    options: [
      "Trapez",
      "Deltoid",
      "Pectoral mare",
      "Latissimus dorsi"
    ],
    correctAnswer: "Trapez",
    category: "sistemul muscular"
  },
  {
    question: "Unde se găsește endomisiumul?",
    options: [
      "În jurul fibrei musculare",
      "În jurul fasciculului",
      "În jurul întregului mușchi",
      "În interiorul miofibrilei"
    ],
    correctAnswer: "În jurul fibrei musculare",
    category: "sistemul muscular"
  },
  {
    question: "Ce proteine sunt responsabile de contracția musculară?",
    options: [
      "Actină și miozină",
      "Colagen și elastină",
      "Keratina și laminina",
      "Fibrina și trombina"
    ],
    correctAnswer: "Actină și miozină",
    category: "sistemul muscular"
  },
  {
    question: "Cum se numește țesutul cartilaginos între corpul vertebrelor?",
    options: [
      "Disc intervertebral",
      "Ligament longitudinal",
      "Endost",
      "Periost"
    ],
    correctAnswer: "Disc intervertebral",
    category: "sistemul osos"
  },
  {
    question: "Ce os formează partea posterioară a craniului?",
    options: [
      "Occipital",
      "Frontal",
      "Parietal",
      "Sphenoid"
    ],
    correctAnswer: "Occipital",
    category: "sistemul osos"
  },
  {
    question: "Care mușchi produce flexia coloanei vertebrale?",
    options: [
      "Rectus abdominis",
      "Erector spinae",
      "Oblic extern",
      "Transvers abdominis"
    ],
    correctAnswer: "Rectus abdominis",
    category: "sistemul muscular"
  },
  {
    question: "Ce mușchi se întinde de la umăr la osul antebrațului?",
    options: [
      "Biceps brahial",
      "Triceps brahial",
      "Deltoid",
      "Coracobrahial"
    ],
    correctAnswer: "Biceps brahial",
    category: "sistemul muscular"
  },
  {
    question: "Care os realizează articulația cotului?",
    options: [
      "Ulna și radius",
      "Femur și tibie",
      "Humerus și scapula",
      "Radius și femur"
    ],
    correctAnswer: "Ulna și radius",
    category: "sistemul osos"
  },
  {
    question: "Ce mușchi ajută la inspirația profundă?",
    options: [
      "Diafragma",
      "Transvers abdominis",
      "Oblic intern",
      "Rectus abdominis"
    ],
    correctAnswer: "Diafragma",
    category: "sistemul muscular"
  },
  {
    question: "Unde se găsește maduva galbenă?",
    options: [
      "În cavitatea medulară a diafizelor",
      "În epifize",
      "În periost",
      "În endost"
    ],
    correctAnswer: "În cavitatea medulară a diafizelor",
    category: "sistemul osos"
  },
  {
    question: "Ce mușchi acționează pentru extensia antebrațului?",
    options: [
      "Triceps brahial",
      "Biceps brahial",
      "Deltoid",
      "Pectoral mare"
    ],
    correctAnswer: "Triceps brahial",
    category: "sistemul muscular"
  },
  {
    question: "Cum se numește capsula care învelește articulațiile mobile?",
    options: [
      "Capsula articulară",
      "Membrana sinovială",
      "Cartilajul articular",
      "Endost"
    ],
    correctAnswer: "Capsula articulară",
    category: "sistemul osos"
  },
  {
    question: "Ce mușchi acționează la mers prin flexia șoldului?",
    options: [
      "Iliopsoas",
      "Gluteus maximus",
      "Hamstrings",
      "Quadriceps"
    ],
    correctAnswer: "Iliopsoas",
    category: "sistemul muscular"
  },
  {
    question: "Care este osul plat care protejează creierul?",
    options: [
      "Parietal",
      "Femur",
      "Scapula",
      "Clavicula"
    ],
    correctAnswer: "Parietal",
    category: "sistemul osos"
  },
  {
    question: "Ce mușchi împiedică hiperextensia genunchiului?",
    options: [
      "Hamstrings",
      "Quadriceps",
      "Gastrocnemius",
      "Tibialis anterior"
    ],
    correctAnswer: "Hamstrings",
    category: "sistemul muscular"
  },
  {
    question: "Ce rol au osteoclastele?",
    options: [
      "Resorbția matricii osoase",
      "Formarea matricei osoase",
      "Sinteza colagenului",
      "Eliberarea hormonilor"
    ],
    correctAnswer: "Resorbția matricii osoase",
    category: "sistemul osos"
  },
  {
  question: "Ce tip de os se formează prin osificare intramembranoasă?",
  options: [
    "Osul frontal",
    "Femurul",
    "Vertebra",
    "Coasta"
  ],
  correctAnswer: "Osul frontal",
  category: "sistemul osos"
},
{
  question: "Care este funcția principală a osteocitelor?",
  options: [
    "Mentinerea matricei osoase",
    "Resorbția osoasă",
    "Formarea matricei organice",
    "Formarea celulelor sanguine"
  ],
  correctAnswer: "Mentinerea matricei osoase",
  category: "sistemul osos"
},
{
  question: "Cum se numește lamela osoasă dispusă concentric în jurul canalului Havers?",
  options: [
    "Sistem Haversian",
    "Lamela interstițială",
    "Osteon",
    "Canal Volkmann"
  ],
  correctAnswer: "Osteon",
  category: "sistemul osos"
},
{
  question: "Ce canal permite vascularizația transversală a osului?",
  options: [
    "Canalul Volkmann",
    "Canalul Havers",
    "Canalul endostal",
    "Canalul medular"
  ],
  correctAnswer: "Canalul Volkmann",
  category: "sistemul osos"
},
{
  question: "Unde găsim os spongios?",
  options: [
    "Epifizele oaselor lungi",
    "Diafizele oaselor lungi",
    "În periost",
    "În ligament"
  ],
  correctAnswer: "Epifizele oaselor lungi",
  category: "sistemul osos"
},
{
  question: "Ce vitamină este esențială pentru absorbția calciului în oase?",
  options: [
    "Vitamina D",
    "Vitamina C",
    "Vitamina K",
    "Vitamina A"
  ],
  correctAnswer: "Vitamina D",
  category: "sistemul osos"
},
{
  question: "Care este rolul periostului?",
  options: [
    "Găzduiește vase și nervi pentru os",
    "Asigură rezistența la compresiune",
    "Provoacă creșterea cartilajului",
    "Formează osteoclastele"
  ],
  correctAnswer: "Găzduiește vase și nervi pentru os",
  category: "sistemul osos"
},
{
  question: "Cum se numește îmbinarea cartilaginoasă dintre diafiză și epifiză la copil?",
  options: [
    "Placă epifizară",
    "Sincondroză",
    "Discontinuitate osoasă",
    "Suturi"
  ],
  correctAnswer: "Placă epifizară",
  category: "sistemul osos"
},
{
  question: "Ce tip de celulă resorbă osul?",
  options: [
    "Osteoclast",
    "Osteoblast",
    "Condroblast",
    "Fibroblast"
  ],
  correctAnswer: "Osteoclast",
  category: "sistemul osos"
},
{
  question: "În care dintre următoarele articulații găsim disc fibrocartilaginos?",
  options: [
    "Articulația mandibulară",
    "Articulația umărului",
    "Articulația șoldului",
    "Articulația cotului"
  ],
  correctAnswer: "Articulația mandibulară",
  category: "sistemul osos"
},
{
  question: "Ce ligament stabilizează coloana cervicală?",
    options: [
      "Ligamentul transvers al atlasului",
      "Ligamentul încrucișat",
      "Ligamentul galben",
      "Ligamentul longitudinal posterior"
    ],
    correctAnswer: "Ligamentul transvers al atlasului",
    category: "sistemul osos"
},
{
  question: "Care mușchi al umărului realizează rotația externă a brațului?",
  options: [
    "Infraspinatus",
    "Subscapularis",
    "Teres major",
    "Pectoral mare"
  ],
  correctAnswer: "Infraspinatus",
  category: "sistemul muscular"
},
{
  question: "Ce mușchi abdominal este situat cel mai profund?",
  options: [
    "Transversus abdominis",
    "Oblic intern",
    "Oblic extern",
    "Rectus abdominis"
  ],
  correctAnswer: "Transversus abdominis",
  category: "sistemul muscular"
},
{
  question: "Ce mușchi acționează ca antagonist al bicepsului brahial?",
  options: [
    "Triceps brahial",
    "Deltoid",
    "Coracobrahial",
    "Brachioradial"
  ],
  correctAnswer: "Triceps brahial",
  category: "sistemul muscular"
},
{
  question: "Care mușchi separă regiunile anterioare și posterioare ale coapsei?",
  options: [
    "Rectus femoris",
    "Sartorius",
    "Adductor longus",
    "Vastus medialis"
  ],
  correctAnswer: "Sartorius",
  category: "sistemul muscular"
},
{
  question: "Ce mușchi al gambei realizează flexia dorsală a piciorului?",
  options: [
    "Tibialis anterior",
    "Gastrocnemius",
    "Soleus",
    "Peroneus longus"
  ],
  correctAnswer: "Tibialis anterior",
  category: "sistemul muscular"
},
{
  question: "În care strat fascial este situat mușchiul deltoid?",
  options: [
    "Epimisium",
    "Perimisium",
    "Endomisium",
    "Intramuscular"
  ],
  correctAnswer: "Epimisium",
  category: "sistemul muscular"
},
{
  question: "Ce proteină declanșează alunecarea fibrelor în sarcomer?",
  options: [
    "Calmodulină",
    "Tropomiozină",
    "Troponină",
    "Titina"
  ],
  correctAnswer: "Troponină",
  category: "sistemul muscular"
},
{
  question: "Cum se numește spațiul dintre fibra musculară și endomisium?",
  options: [
    "Spațiul interstițial",
    "Spațiul sinaptic",
    "Spațiul fascicular",
    "Spațiul epimisial"
  ],
  correctAnswer: "Spațiul interstițial",
  category: "sistemul muscular"
},
{
  question: "Ce tip de contracție musculară menține tonusul fără mișcare vizibilă?",
  options: [
    "Izometrică",
    "Izotonică concentrica",
    "Izotonică excentrică",
    "Isokinatică"
  ],
  correctAnswer: "Izometrică",
  category: "sistemul muscular"
},
{
  question: "Care mușchi al spatelui ajută la extensia trunchiului?",
  options: [
    "Erector spinae",
    "Latissimus dorsi",
    "Trapez",
    "Romboizi"
  ],
  correctAnswer: "Erector spinae",
  category: "sistemul muscular"
},
{
  question: "Ce mușchi are rol principal în masticație?",
  options: [
    "Masseter",
    "Temporalis",
    "Pterygoid medial",
    "Buccinator"
  ],
  correctAnswer: "Masseter",
  category: "sistemul muscular"
},
{
  question: "Care termen desemnează un punct fix de inserție musculară?",
  options: [
    "Origine",
    "Inserție",
    "Centru"
    , "Fascia"
  ],
  correctAnswer: "Origine",
  category: "sistemul muscular"
},
{
  question: "Ce mușchi al șoldului face rotația internă?",
  options: [
    "Gluteus minimus",
    "Gluteus maximus",
    "Piriformis",
    "Obturator intern"
  ],
  correctAnswer: "Gluteus minimus",
  category: "sistemul muscular"
},
{
  question: "Ce rol are trofismul osos?",
  options: [
    "Reglarea metabolismului mineral osos",
    "Transmiterea impulsului nervos",
    "Susținerea mușchilor",
    "Sincronizarea articulațiilor"
  ],
  correctAnswer: "Reglarea metabolismului mineral osos",
  category: "sistemul osos"
},
{
  question: "Cum se numesc celulele care pot deveni osteoblaste?",
  options: [
    "Celule mezenchimale",
    "Osteocite",
    "Condrocite",
    "Fibroblaste"
  ],
  correctAnswer: "Celule mezenchimale",
  category: "sistemul osos"
},
{
  question: "Ce ligament traversează gaura obturată?",
  options: [
    "Ligamentul obturator",
    "Ligamentul inguinal",
    "Ligamentul transvers al genunchiului",
    "Ligamentul coracohumeral"
  ],
  correctAnswer: "Ligamentul obturator",
  category: "sistemul osos"
},
{
  question: "Care este efectul adrenalinei asupra tonusului muscular neted visceral?",
  options: [
    "Relaxare",
    "Contractie",
    "Nici unul",
    "Fibroză"
  ],
  correctAnswer: "Relaxare",
  category: "sistemul muscular"
},
{
  question: "Unde găsim fîșe musculare în os?",
  options: [
    "În lamelă Haversiană",
    "În periost",
    "În medular",
    "În endost"
  ],
  correctAnswer: "În periost",
  category: "sistemul osos"
},
{
  question: "Ce fir muscular generează potențial de acțiune?",
  options: [
    "Fibra striată scheletică",
    "Fibra netedă",
    "Fibra cardiac",
    "Fibra de colagen"
  ],
  correctAnswer: "Fibra striată scheletică",
  category: "sistemul muscular"
},
{
  question: "Ce tip de colagen predomină în substanța organică osoasă?",
  options: [
    "Colagen de tip I",
    "Colagen de tip II",
    "Colagen de tip III",
    "Colagen de tip IV"
  ],
  correctAnswer: "Colagen de tip I",
  category: "sistemul osos"
},
{
  question: "Ce mușchi al gambei se inseră pe calcaneu?",
  options: [
    "Gastrocnemius",
    "Tibialis anterior",
    "Peroneus tertius",
    "Soleus"
  ],
  correctAnswer: "Gastrocnemius",
  category: "sistemul muscular"
},
{
  question: "Ce ligament stabilizează genunchiul medial?",
  options: [
    "Ligament colateral tibial",
    "Ligament cruciat anterior",
    "Ligament popliteu",
    "Ligament meniscal"
  ],
  correctAnswer: "Ligament colateral tibial",
  category: "sistemul osos"
},
{
  question: "Cum se numește procesul de acțiune al actinei și miozinei?",
  options: [
    "Kontraktilitate",
    "Excitabilitate",
    "Elasticitate",
    "Extensibilitate"
  ],
  correctAnswer: "Kontraktilitate",
  category: "sistemul muscular"
},
{
  question: "Ce tip de articulație găsim între vertebrele adiacente?",
  options: [
    "Sincondroză",
    "Diartroză",
    "Sinartroză",
    "Anfiartroză"
  ],
  correctAnswer: "Anfiartroză",
  category: "sistemul osos"
}
  ];

  try {
    const db = firebase.firestore();
    const batch = db.batch();

    questions.forEach((question) => {
      const docRef = db.collection('questions').doc();
      batch.set(docRef, question);
    });

    await batch.commit();
    console.log('Questions initialized successfully!');
    alert('Questions have been added to the database!');
  } catch (error) {
    console.error('Error initializing questions:', error);
    alert('Error adding questions: ' + error.message);
  }
  
}