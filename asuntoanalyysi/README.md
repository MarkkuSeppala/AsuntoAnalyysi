# AsuntoAnalyysi

Tekoälyavusteinen sovellus asuntojen myynti-ilmoitusten analysointiin.

## Kuvaus

AsuntoAnalyysi on web-sovellus, joka käyttää tekoälyä analysoimaan asuntojen myynti-ilmoituksia. Sovellus ottaa vastaan PDF-muotoisen asuntoilmoituksen, analysoi sen sisällön tekoälyn avulla ja tuottaa asiantuntevan analyysin, joka auttaa asunnonostajia tekemään parempia päätöksiä.

## Ominaisuudet

- PDF-tiedostojen lataus selaimessa
- PDF-sisällön tekstin erottaminen
- Tekoälypohjainen analyysi Google Gemini API:n avulla
- Markdown-muotoisen analyysin näyttäminen

## Teknologiat

### Backend
- Node.js
- Express
- Multer (tiedostojen käsittely)
- pdf-parse (PDF-tiedostojen lukeminen)
- Google Gemini API

### Frontend
- React
- Axios (HTTP-pyynnöt)
- Tailwind CSS (tyylittely)
- React Markdown (Markdown-muotoilun näyttäminen)

## Käyttöönotto

### Vaatimukset
- Node.js (versio 14 tai uudempi)
- Google Gemini API-avain

### Asennus

1. Kloonaa tämä repositorio
```
git clone <repository-url>
cd asuntoanalyysi
```

2. Asenna backend-riippuvuudet
```
cd backend
npm install
```

3. Luo .env-tiedosto backend-hakemistoon
```
GEMINI_API_KEY=sinun_gemini_api_avain
PORT=3001
```

4. Asenna frontend-riippuvuudet
```
cd ../frontend
npm install
```

### Käynnistäminen

1. Käynnistä backend
```
cd backend
npm run dev
```

2. Käynnistä frontend (toisessa terminaalissa)
```
cd frontend
npm run dev
```

3. Avaa selain osoitteessa [http://localhost:5173](http://localhost:5173)

## Käyttö

1. Lataa PDF-muotoinen asuntoilmoitus sovellukseen
2. Klikkaa "Analysoi ilmoitus" -painiketta
3. Odota hetki analyysin valmistumista
4. Lue analyysi ja tarkastele asiantuntijan näkemyksiä asunnosta

## Lisenssi

MIT 