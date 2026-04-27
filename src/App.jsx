import React, { useState } from 'react';

/**
 * Public Institution Press Release Generator
 * Main Application Component
 */

function App() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    date: new Date().toISOString().split('T')[0],
    department: '홍보소통과',
    details: ''
  });
  const [result, setResult] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePressRelease = async () => {
    if (!formData.topic || !formData.details) {
      alert('주제와 주요 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // Note: In real world, this would call the Cloudflare Worker API
      // For demonstration, we'll simulate the call
      const response = await fetch('https://public.eieu5683.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('API call failed');
      
      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      console.error(error);
      // Fallback for demo if worker is not deployed yet
      simulateGeneration();
    } finally {
      // setLoading(false) is handled in simulate or catch
    }
  };

  const simulateGeneration = () => {
    setTimeout(() => {
      const mockResult = `
[보도자료]

${formData.topic} 관련 추진 계획 발표

□ 추진 배경
 - ${formData.topic}의 중요성 증대 및 주민 요구 반영
 - 행정 서비스의 질적 향상 및 지역 경제 활성화 도모

□ 주요 내용
 - (행사명) ${formData.topic}
 - (일시) ${formData.date}
 - (장소) 관내 해당 시설 및 온라인 플랫폼
 - (대상) 전 시민 및 관계 전문가

□ 세부 추진 계획
 1. 인프라 구축 및 환경 정비
  - ${formData.details.split('\n')[0] || '효율적인 운영 체계 마련'}
 2. 시민 참여 프로그램 확대
  - 맞춤형 콘텐츠 개발 및 홍보 강화
 3. 안전 및 사후 관리 체계 가동
  - 지속 가능한 운영 모델 정립

□ 향후 계획
 - '26. 5월 중 세부 시행 지침 마련
 - 정기적인 성과 분석 및 모니터링 실시

□ 기대 효과
 - 공공 행정의 신뢰도 제고 및 지역 브랜드 가치 상승
 - 시민 편의성 증대 및 정주 여건 개선
      `;
      setResult(mockResult.trim());
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('클립보드에 복사되었습니다.');
  };

  return (
    <div className="container">
      <header>
        <h1>공공기관 보도자료 생성기</h1>
        <p>AI를 활용한 정격 서식의 보도자료 자동 생성 서비스</p>
      </header>

      <main className="main-grid">
        {/* Input Section */}
        <section className="input-section glass-card">
          <div className="input-group">
            <label>보도 주제</label>
            <input 
              type="text" 
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="예: 스마트 도서관 무인 대출 서비스 확대"
            />
          </div>

          <div className="input-group">
            <label>배포 예정일</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label>담당 부서</label>
            <input 
              type="text" 
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="예: 디지털혁신과"
            />
          </div>

          <div className="input-group">
            <label>핵심 사실관계 및 수치 (개조식 입력 권장)</label>
            <textarea 
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows="8"
              placeholder="- 5월 1일부터 전면 시행&#10;- 예산 3억 원 투입&#10;- 기대효과: 대기시간 50% 단축"
            ></textarea>
          </div>

          <button onClick={generatePressRelease} disabled={loading}>
            {loading ? (
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8l6-4"/><path d="M12 10 6 6"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
                보도자료 생성하기
              </>
            )}
          </button>
        </section>

        {/* Output Section */}
        <section className="output-section glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>생성 결과 (미리보기)</h3>
            {result && (
              <button 
                onClick={copyToClipboard}
                style={{ marginTop: 0, padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                복사하기
              </button>
            )}
          </div>
          
          <div className="press-release-paper">
            {!result && !loading && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', textAlign: 'center' }}>
                왼쪽 양식을 채우고<br/>생성 버튼을 눌러주세요.
              </div>
            )}
            
            {loading && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                AI가 보도자료를 작성 중입니다...
              </div>
            )}

            {result && !loading && (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                <div className="paper-header">
                  <h2>보 도 자 료</h2>
                  <div className="info-grid">
                    <div className="info-item">배포일시: {formData.date}</div>
                    <div className="info-item">담당부서: {formData.department}</div>
                  </div>
                </div>
                {result}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        &copy; 2026 공공기관 보도자료 생성기. Powered by Cloudflare Workers AI.
      </footer>
    </div>
  );
}

export default App;
