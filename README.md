# 촉매-X MVP

KIRO로 만드는 촉매-X 팀 앱의 시작 템플릿입니다.

## 시작하기

1. GitHub 가입 → 멘토에게 아이디 전달 → 메일로 온 초대 수락
2. KIRO 첫 화면에서 **Clone repository**를 누르고 아래 주소 붙여넣기
   ```
   https://github.com/seanhong-jpg/chokmae-x.git
   ```
3. 저장할 폴더를 고르고 **Open**
4. `first-prompt.txt`에서 `<누가>`, `<화면1>`처럼 표시된 자리를 앱 내용으로 바꿔 KIRO 채팅 창에 붙여넣기
   - 팀에서 한 명만 진행하고, 나머지는 그 사람이 push한 뒤 pull

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `.kiro/steering/project-rules.md` | KIRO가 대화할 때마다 자동으로 읽는 규칙. 기술 스택, 포트(8000), DB 환경변수, MVP 범위가 들어 있음 |
| `first-prompt.txt` | 프로젝트 뼈대를 만들 때 KIRO에게 처음 한 번 보내는 문장 |
| `.env.example` | DB 접속 정보 4개의 양식. 실제 값은 `.env`에 넣고, `.env`는 GitHub에 올라가지 않음 |
| `local-db/` | `.env`가 비어 있을 때 임시 MySQL로 앱을 띄우는 도구 (배포 전 확인용) |
| `.gitignore` | GitHub에 올리지 않을 파일 목록 |

## 참고

- `.kiro` 폴더도 GitHub에 함께 올라가서, 서버의 KIRO도 같은 규칙을 읽습니다.
- 윈도우 탐색기에서 `.kiro`가 안 보이면 **보기 → 표시 → 숨긴 항목**을 체크합니다.
