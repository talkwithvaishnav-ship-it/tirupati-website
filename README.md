# TIRUPATI INFRACARE — Website (Free: Vercel + Cloudinary, bina backend)

Website ka design, pages, services, city pages, blog — sab pehle jaisa hi hai.
Sirf ye badla hai:

| Pehle (Emergent) | Ab |
|---|---|
| Python backend + MongoDB | **Koi backend nahi** |
| Emergent object storage | **Cloudinary** (photos + videos) |
| Data MongoDB me | Data **`src/data/site-data.json`** me (GitHub repo ke andar) |
| Admin login (email/password) | `/admin` page + GitHub token (sirf aapke browser me) |
| Leads MongoDB me save | Leads seedha **WhatsApp** par (Lead ID + photos ke links ke saath) |
| Emergent hosting | **Vercel** (free) |

---

## 1. Cloudinary setup (free, ~5 min)

1. https://cloudinary.com par free account banao.
2. Dashboard par **Cloud name** likh lo (jaise `dxyz123`).
3. **Settings → Upload → Upload presets → Add upload preset**:
   - **Preset 1 – Admin ke liye** (projects / videos / reviews)
     - Name: kuch mushkil sa rakho, jaise `tic_admin_8f3k2` (ye password jaisa hai, kisi ko mat batana)
     - Signing mode: **Unsigned**
     - Asset folder: `tirupati-infracare`
     - Save
   - **Preset 2 – Customer leakage photos ke liye (optional)**
     - Name: `tic_leads`
     - Signing mode: **Unsigned**
     - Asset folder: `tirupati-infracare/leads`
     - Allowed formats: `jpg,png,webp`  •  Max file size: `5000000`
     - Save

> Free plan: 25 credits/month (1 credit ≈ 1 GB storage **ya** 1 GB bandwidth). Video max **100 MB** per file, photo max 10 MB.
> Videos ko upload karne se pehle compress kar lo (720p kaafi hai) — credits bachenge.

## 2. GitHub par code daalo

1. https://github.com par new **private** repository banao, jaise `tirupati-website`.
2. Is folder ki saari files us repo me upload/push karo (`node_modules` aur `build` nahi).

```bash
git init
git add .
git commit -m "Tirupati Infracare website"
git branch -M main
git remote add origin https://github.com/<aapka-username>/tirupati-website.git
git push -u origin main
```

## 3. Vercel par deploy (free)

1. https://vercel.com → GitHub se login → **Add New → Project** → apna repo **Import** karo.
2. Framework apne aap **Create React App** aayega. Kuch change mat karo.
3. **Environment Variables** me daalo (`.env.example` dekho):
   - `REACT_APP_SITE_URL` = aapka domain (jaise `https://www.tirupatiinfracare.com`)
   - `REACT_APP_CLOUDINARY_CLOUD_NAME` = cloud name
   - `REACT_APP_CLOUDINARY_LEAD_PRESET` = `tic_leads` (optional)
   - `REACT_APP_GITHUB_OWNER`, `REACT_APP_GITHUB_REPO` (optional — admin page me pehle se bhare aayenge)
4. **Deploy** dabao. 1–2 minute me website live.
5. Domain lagana ho to: Project → Settings → Domains.

## 4. GitHub token banao (admin se "Publish" karne ke liye)

1. GitHub → Settings → Developer settings → **Personal access tokens → Fine-grained tokens → Generate new token**
2. Repository access: **Only select repositories** → apna website repo
3. Permissions → Repository permissions → **Contents: Read and write**
4. Expiration: 1 saal (expire hone par naya bana lena)
5. Token copy kar lo (`github_pat_...`).

## 5. Admin use karna — `https://aapki-website.com/admin`

1. Pehli baar **Connection** me bharo: GitHub username, repo, branch `main`, token, Cloudinary cloud name, **admin preset** → *Save Connection*.
   (Ye sab sirf aapke browser me save hota hai. Dusre phone/laptop par dobara bharna padega.)
2. Ab project / video / review / settings **add, edit, delete** karo. Photo/video **Upload** karte hi Cloudinary par chali jaati hai.
3. Last me **Publish to Website** dabao → GitHub me `site-data.json` update hoti hai → Vercel 1–2 min me website update kar deta hai.

**Bina admin page ke (pure manual):**
Cloudinary Media Library me file upload karo → uska URL copy karo → GitHub par `src/data/site-data.json` edit karke URL paste karo → *Commit*. Vercel apne aap deploy kar dega.
Admin me har photo/video ke aage 🔗 button se bhi Cloudinary URL paste kar sakte ho.

### `site-data.json` ka format (example)

```json
{
  "settings": { "business_name": "TIRUPATI INFRACARE", "phone": "+91 8989994651", "whatsapp_number": "918989994651", "email": "info@tirupatiinfracare.com", "address": "", "google_business_profile_url": "", "opening_hours": "", "service_areas": ["Nagpur", "Pune"] },
  "projects": [
    { "id": "p1", "slug": "terrace-waterproofing-nagpur", "project_name": "Terrace Waterproofing Nagpur", "location": "Nagpur", "service": "Terrace Waterproofing", "category": "Terrace", "area": 1200, "completion_date": "2026-08-01", "description": "...", "problem": "...", "inspection": "...", "solution": "...", "result": "...", "before_photo": { "url": "https://res.cloudinary.com/<cloud>/image/upload/....jpg" }, "after_photo": { "url": "https://res.cloudinary.com/<cloud>/image/upload/....jpg" }, "published": true, "created_at": "2026-08-01T00:00:00Z" }
  ],
  "videos": [
    { "id": "v1", "title": "Terrace coating work", "description": "...", "service_category": "Terrace Waterproofing", "location": "Nagpur", "active": true, "display_order": 0, "video_asset": { "url": "https://res.cloudinary.com/<cloud>/video/upload/....mp4" }, "thumbnail_asset": null, "created_at": "2026-08-01T00:00:00Z", "updated_at": "2026-08-01T00:00:00Z" }
  ],
  "testimonials": [
    { "id": "t1", "customer_name": "Name", "city": "Nagpur", "service": "Terrace Waterproofing", "rating": 5, "review_text": "...", "property_type": "Residential", "photo_asset": null, "published": true, "display_order": 0, "created_at": "2026-08-01T00:00:00Z", "updated_at": "2026-08-01T00:00:00Z" }
  ]
}
```

- `thumbnail_asset: null` → video ka thumbnail Cloudinary apne aap bana deta hai.
- `category` sirf ye ho sakti hai: Terrace, Roof, Bathroom, Basement, Commercial, Industrial.

## Zaruri baatein

- **Leads**: backend nahi hai, isliye form bharte hi WhatsApp khulta hai with saari details + Lead ID. Customer ko *Send* dabana padta hai (pehle bhi aisa hi tha). Lead preset set hai to photos Cloudinary par jaake unke links message me aate hain; warna customer chat me photo bhej dega.
- **Delete**: admin se delete karne par item website se hat jaata hai, par file Cloudinary me rehti hai — Media Library se khud delete kar sakte ho.
- **Local chalana**: `yarn install` → `yarn start` (Node 18+).
