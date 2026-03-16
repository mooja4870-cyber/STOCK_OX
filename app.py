import streamlit as st

st.set_page_config(page_title="React Vite Project Deployment", layout="centered")
st.title("StockFit (React 프로젝트) 🚀")

st.markdown("""
### ⚠️ 배포 플랫폼 안내

현재 보고 계신 레포지토리는 Python 기반의 원본 Streamlit 앱이 아닌, **성능과 UI가 극대화된 React(Vite) + Tailwind CSS** 프로젝트입니다. 
따라서 원활한 서비스 운영을 위해서는 Streamlit 배포 환경보다 전문 프론트엔드 호스팅 서비스 이용을 강력히 권장합니다.

---

#### 💡 가장 이상적인 무료 배포 방법 3가지

1. **Vercel (추천! 1분 컷)**
   - Vercel에 로그인 후 현재 GitHub 저장소를 연결하기만 하면 자동으로 빌드 및 배포가 완료됩니다. (설정 파일 `vercel.json` 준비 완료)

2. **Netlify**
   - Netlify에서 저장소 연동 시 즉시 배포 구동됩니다. (설정 파일 `netlify.toml` 준비 완료)

3. **Render / GitHub Pages**
   - 정적 웹 호스팅 서비스로 쉽게 구동할 수 있습니다.

> 만약 해당 프로젝트를 억지로 Streamlit 래핑하여 구동 시 React의 고급 애니메이션 및 성능 최적화의 손실이 있을 수 있어 프론트엔드 전용 서버리스 배포를 추천합니다.
""")
