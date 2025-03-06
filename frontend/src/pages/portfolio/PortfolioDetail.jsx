import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Container, Spinner, Modal, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import portfolioApi from "../../api/portfolioApi";
import BookmarkPortfolioBtn from "../../components/bookmark/BookmarkPortfolioBtn";
import { getMyProjects } from "../../api/projectApi"; // 내가 만든 프로젝트 목록을 가져올 API
import alertApi from "../../api/alertApi"; // 프로젝트 초대 API 호출
import SkillTagComponent from "../../components/skill/SkillTagComponent";
import SkillTagGuideComponent from "../../components/skill/SkillTagGuideComponent";
import { AlertContext } from "../../context/AlertContext";

const PortfolioDetail = () => {
  const { portfolioId } = useParams(); // URL에서 portfolioId 가져오기
  const navigate = useNavigate();
  const { refreshAlerts } = useContext(AlertContext);

  // 포트폴리오 초기 상태 설정
  const portfolioInit = {
    id: null,
    title: "",
    description: "",
    userId: null,
    links: "",
    createdAt: "",
    updatedAt: "",
    image_url: "",
    skills: "",
    github_url: "",
  };

  const [portfolio, setPortfolio] = useState(portfolioInit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioAlert, setPortfolioAlert] = useState(null);
  
  // 초대 모달 관련 상태
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [inviting, setInviting] = useState(false);

  // 현재 로그인한 사용자 ID (임시: localStorage)
  const currentUserId = Number(localStorage.getItem("currentUserId"));

  // 포트폴리오 상세 정보 불러오기
  useEffect(() => {
    if (!portfolioId) {
      setError("올바른 포트폴리오 ID가 아닙니다.");
      setLoading(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await portfolioApi.getOne(portfolioId);
        if (!data || !data.id) throw new Error("데이터가 존재하지 않습니다.");
        console.log("📌 포트폴리오 데이터:", data);
        setPortfolio(data);
      } catch (err) {
        console.error("❌ 포트폴리오 조회 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  // 포트폴리오 알림 조회 (현재 로그인 사용자가 받은 알림 중 해당 포트폴리오 관련 알림)
  useEffect(() => {
    const fetchPortfolioAlert = async () => {
      try {
        const alerts = await alertApi.getProjectAlerts(); // 포트폴리오 알림 조회 API (API 이름이 약간 헷갈릴 수 있으니 실제 API에 맞게 수정)
        const matchingAlert = alerts.find(
          (alert) => Number(alert.portfolio.id) === Number(portfolioId)
        );
        setPortfolioAlert(matchingAlert);
      } catch (err) {
        console.error("알림 조회 실패:", err);
      }
    };

    fetchPortfolioAlert();
  }, [portfolioId]);

  // 내 프로젝트 목록 가져오기
  const fetchMyProjects = async () => {
    try {
      const data = await getMyProjects();
      setMyProjects(data);
    } catch (err) {
      console.error("❌ 내 프로젝트 목록 조회 실패:", err);
      alert(`내 프로젝트 목록 조회 실패: ${err.message}`);
    }
  };

  // 초대 모달 열기: 자신의 포트폴리오는 초대 불가
  const handleOpenInviteModal = () => {
    if (portfolio.userId === currentUserId) {
      alert("자신의 포트폴리오는 초대할 수 없습니다.");
      return;
    }
    setShowInviteModal(true);
    fetchMyProjects();
  };

  // 초대 요청 전송: 초대 후 전역 알림 새로고침
  const handleInviteConfirm = async () => {
    if (!selectedProjectId) {
      alert("초대할 프로젝트를 선택해주세요.");
      return;
    }
    try {
      setInviting(true);
      await alertApi.inviteToProject(selectedProjectId, portfolio.userId);
      alert("초대가 성공적으로 전송되었습니다.");
      // 약간의 딜레이 후 전역 알림 업데이트
      setTimeout(async () => {
        await refreshAlerts();
        const alerts = await alertApi.getportfolioAlerts();
        const matchingAlert = alerts.find(
          (alert) => Number(alert.portfolio.id) === Number(portfolioId)
        );
        setPortfolioAlert(matchingAlert);
      }, 500);
      setShowInviteModal(false);
      setSelectedProjectId("");
    } catch (err) {
      console.error("❌ 초대 전송 실패:", err);
      alert(`초대 전송 실패: ${err.message}`);
    } finally {
      setInviting(false);
    }
  };

  // 포트폴리오 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm("정말 이 포트폴리오를 삭제하시겠습니까?")) return;
    try {
      setLoading(true);
      await portfolioApi.deleteProject(portfolioId);
      alert("포트폴리오가 성공적으로 삭제되었습니다.");
      navigate("/portfolio/list");
    } catch (err) {
      console.error("❌ 포트폴리오 삭제 실패:", err);
      setError("포트폴리오 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로딩 및 에러 처리 화면
  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>로딩 중...</p>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/portfolio/list">
          <Button variant="secondary">목록으로 돌아가기</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Img
          variant="top"
          src={portfolio.image_url || "/default-image.png"}
          alt="포트폴리오 이미지"
        />
        <Card.Body>
          <BookmarkPortfolioBtn portfolioId={portfolio.id} />
          <Card.Title>{portfolio.title || "제목 없음"}</Card.Title>
          <Card.Text>{portfolio.description || "설명이 없습니다."}</Card.Text>
          <Card.Text>
            <SkillTagGuideComponent />
            <SkillTagComponent skills={portfolio.skills} />
          </Card.Text>
          {portfolio.github_url && (
            <Card.Link href={portfolio.github_url} target="_blank">
              GitHub 링크
            </Card.Link>
          )}
          <div className="d-flex flex-wrap mt-3">
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/portfolio/modify/${portfolioId}`, { state: { portfolio } })
              }
            >
              수정
            </Button>
            <Button variant="danger" className="ms-2" onClick={handleDelete}>
              삭제
            </Button>
            {portfolio.userId !== currentUserId && (
              <Button variant="success" className="ms-2" onClick={handleOpenInviteModal}>
                초대하기
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
      <Link to="/portfolio/list">
        <Button variant="secondary" className="mt-4">
          목록으로 돌아가기
        </Button>
      </Link>

      {/* 초대 모달 */}
      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>프로젝트 초대</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="projectSelect">
            <Form.Label>초대할 나의 프로젝트 선택</Form.Label>
            <Form.Control
              as="select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">-- 선택하세요 --</option>
              {myProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleInviteConfirm} disabled={inviting}>
            {inviting ? "전송 중..." : "전송"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PortfolioDetail;
