const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// CORS-asetusten tarkempi määrittely
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Google Gemini API konfiguraatio
console.log('Gemini AI API konfiguroitu onnistuneesti');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Multer konfiguraatio PDF-tiedostojen vastaanottamiseen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Vain PDF-tiedostot ovat sallittuja'));
    }
  }
});

// AI-analyysin ohjeistus
const getAnalysisPrompt = (pdfContent) => {
  return `
Olet kiinteistö- ja kiinteistövälityksen kokennut ammattilainen.
Tehtävänäsi on tehdä ostajalle analyysi myynnisssä olevasta kohteesta.

**TÄMÄ ON TÄRKEÄÄ:**
Perhedy tietoihin huolellisesi. Tee kohteen tiedoista implisiittiä päätelmiä ostajalle tärkeistä asioista.

Hinta-arvioanalyysissä käytä ainostaan kohteen velatonta hintaa.


Laadi teksi kohteliaaseen, mutta asiantuntijamaiseen tyyliin.
Älä kommentoi välitysliikettä tai välittäjää.


Alla kuvaus vastauksen rakenteesta.

*RAKENNEKUVAUS START*

**KOHDE:**
"Kaivokselantie 5, Vantaa"


*1. Sijainti ja alueellinen konteksti*
*2. Rakennus ja taloyhtiö*
*3. Asunto ja varustelutaso*
*4. Markkina- ja ostotilanne*
*5. Mahdolliset huomiot tai riskitekijät*
*6. Kohteen hinta verrattuna vastaaviin*



**Yhteenveto**

*Sijainti:*
*Taloyhtiö ja rakennus:*
*Asunnon varustelu:*
*Jälleenmyyntinäkymä:*
*Mahdolliset riskit:*
*Kunnossapitotarpeet ja autopaikan erillisyys:*

*RAKENNEKUVAUS END*


**Tämä on tärkeää:** ANNA VASTAUS MARKDOWN -MUODOSSA!



Seuraavaksi esimerkki vastauksesta.

**Esimerkkituloste start**


**KOHDE:**
"Kaivokselantie 5, Vantaa"

________________


1. Sijainti ja alueellinen konteksti
"Kaivoksela sijaitsee Vantaan länsiosassa Kehä I:n ja Vihdintien välimaastossa, mikä tekee sijainnista erityisen kiinnostavan etenkin työmatkaliikkujille. Alueen profiili on keskiluokkainen ja arjessa toimiva: läheisyydessä on kauppoja, kouluja ja päiväkoteja, mutta alue ei ole profiloitunut trendikkääksi tai erityisesti statusta viestiväksi. Alueen arvo voi kasvaa pitkällä aikavälillä erityisesti joukkoliikenteen kehittyessä.
Johtopäätös ostajalle: Sijainti on liikenteellisesti hyvä ja arjen toimivuuden kannalta suotuisa, mutta alueella ei ole erityistä statuselementtiä tai korkeaa aluebrändiä, joka vaikuttaisi jälleenmyyntiarvoon yläkanttiin."
________________


2. Rakennus ja taloyhtiö
"Taloyhtiö on valmistunut vuonna 2010, mikä tekee siitä teknisesti vielä modernin. Tällaisissa rakennuksissa esimerkiksi rakennusmateriaalit, energiatehokkuus ja äänieristys ovat yleisesti hyvällä tasolla. Yhtiö ei ole vielä tullut suurempien peruskorjausten ikäluokkaan, mutta 15 vuoden jälkeen huoltotoimia on alettava arvioimaan aktiivisesti (esimerkiksi ilmanvaihto, LTO-järjestelmä, julkisivujen kunto).
Näkyvästi ei korosteta isompia remontteja tai varautumista sellaisiin, mikä antaa ostajalle käsityksen vakaasta kunnossapidosta. Samalla on kuitenkin syytä huomata, että 15 vuoden ikä alkaa hiljalleen tuoda huoltotarpeita (esim. ilmanvaihto, julkisivujen tarkastus). Näistä ei kuitenkaan vielä ole mainintaa, mikä indikoi teknisesti terveenä pidettyä yhtiötä.
Yhtiön asiakirjoissa viitataan lämmön talteenoton ja lämmitysjärjestelmän tehostamistarpeisiin. Tämä viittaa hallittuun kunnossapitostrategiaan, mutta voi tulevaisuudessa aiheuttaa kustannuksia osakkaille, vaikka tarkkoja summia ei vielä ole.
Johtopäätös ostajalle: Taloyhtiö vaikuttaa olevan teknisesti kunnossa ja hallinto on ennakoivaa. Tuleviin, maltillisiin kehitystoimiin on kuitenkin syytä varautua."
________________


3. Asunto ja varustelutaso
"Asunnon yleisilme on vaalea, neutraali ja ajaton. Tällainen sisustus toimii monenlaisille asukkaille ja mahdollistaa helpon muokkaamisen. Olohuone-keittiöratkaisu on nykyaikainen ja lasitettu parveke lisää käyttökelpoista tilaa, erityisesti kevät- ja kesäkaudella.
Asunnossa on oma sauna, mikä parantaa asumismukavuutta ja jälleenmyyntiarvoa. Hissi ja esteetön kulku lisäävät kohteen soveltuvuutta myös ikääntyville tai liikuntarajoitteisille. Autopaikan saatavuus (ostoerikseen) on erityisesti tässä sijainnissa merkittävä etu.
Johtopäätös ostajalle: Asunto on teknisesti ja visuaalisesti kunnossa, sopii laajalle kohderyhmälle ja sisältää asumista parantavia elementtejä (sauna, hissi, esteettömyys, parveke)."
________________


4. Markkina- ja ostotilanne:
"Esitteestä ei käy ilmi myyntiajan pituutta tai kiinnostuksen määrää, mikä viittaa joko yksityiseen myyntiin tai maltilliseen kysyntään. Tämä voi luoda ostajalle neuvotteluvaraa. Myyntiesite ei myöskään korosta erityisiä kilpailuetuja – kohde ei "myy itseään", mikä puolestaan usein tarkoittaa, että sen arvot löytyvät käytännöllisyydestä, ei näyttävyydestä.
Johtopäätös ostajalle: Kohde ei vaikuta olevan erityisen "kuuma", mikä voi tarkoittaa ostajalle edullisempaa neuvotteluasemaa. Arvo muodostuu käytännön edusta, ei tunneperäisestä vetovoimasta."
________________


5. Mahdolliset huomiot tai riskitekijät
"Asunto ei sijaitse uudella alueella eikä erityisen profiloituneessa kaupunginosassa → jälleenmyynnissä kilpailu voi olla kovaa, ja hinta ei todennäköisesti nouse rajusti ilman aluekehitystä.
Vaikka yhtiö on nuori, teknisen elinkaaren siirtymäkohta alkaa lähestyä → pitkän aikavälin kustannuksiin kannattaa varautua.
Autopaikka ei sisälly hintaan → ostajalla on lisämenoja, mikäli autopaikka on tarpeellinen."

________________

6. Kohteen hinta verrattuna vastaaviin
"Kohteen neliöhinta (3 464 €/m²) on hieman alle alueen keskiarvon (3 591 €/m²), mikä tekee siitä kilpailukykyisen tarjouksen nykyisessä markkinatilanteessa. Ottaen huomioon alueen hintakehityksen ja kohteen hyvän kunnon, hinta vaikuttaa perustellulta."

________________



Yhteenveto
Sijainti: "Hyvä arkilähtöisesti. Ei erityistä aluearvoa, mutta toimiva ja kehittyvä"

Taloyhtiö ja rakennus: "Moderni, hyvin hoidettu. Seuraava kunnossapitovaihe lähestyy 3–7 vuoden aikajänteellä"
	
Asunnon varustelu: "Hyvä, Oma sauna, hissi, esteetön → pitkäaikaisasumiseen sopiva."


Jälleenmyyntinäkymä: "Neutraali, Ei erityisiä vetovoimatekijöitä, mutta teknisesti kelvollinen."

Mahdolliset riskit: "Pienet/maltilliset. Kunnossapitotarpeet ja autopaikan erillisyys."




**Esimerkkituloste end**


Viimeisenä myyntiesite
**ANALYSOITAVAN ASUNNON MYYNTIESITE START**


  
  ${pdfContent}
  `;
};

// Lisätään testiendpoint
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Backend-palvelin toimii!' });
});

// Reitti PDF-tiedoston käsittelyyn ja analyysin luomiseen
app.post('/analyze', upload.single('pdfFile'), async (req, res) => {
  try {
    console.log('PDF-analyysi pyyntö vastaanotettu');
    
    if (!req.file) {
      console.log('Virhe: PDF-tiedostoa ei lähetetty');
      return res.status(400).json({ error: 'PDF-tiedostoa ei lähetetty' });
    }

    console.log('Tiedosto vastaanotettu:', req.file.path);
    const pdfPath = req.file.path;
    
    // Luetaan PDF-tiedosto
    console.log('Luetaan PDF-tiedosto...');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const pdfContent = pdfData.text;
    console.log('PDF-sisältö luettu, merkkejä:', pdfContent.length);
    
    // Luodaan analyysi Google Gemini AI:n avulla
    console.log('Luodaan analyysi Gemini AI:n avulla...');
    const prompt = getAnalysisPrompt(pdfContent);
    
    // Käytetään Gemini "gemini-2.0-flash" -mallia
    console.log('Käytetään mallia: gemini-2.0-flash');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log('Lähetetään pyyntö Gemini API:lle...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    console.log('Analyysi vastaanotettu, pituus:', analysis.length);
    
    // Poistetaan väliaikainen PDF-tiedosto
    fs.unlinkSync(pdfPath);
    console.log('Väliaikainen PDF-tiedosto poistettu');
    
    // Palautetaan analyysi
    console.log('Palautetaan analyysi clientille');
    res.json({ 
      analysis: analysis 
    });
  } catch (error) {
    console.error('Virhe analyysin luomisessa:', error);
    res.status(500).json({ error: 'Analyysin luominen epäonnistui', details: error.message });
  }
});

// Käynnistetään palvelin
app.listen(port, () => {
  console.log(`Palvelin käynnissä portissa ${port}`);
}); 