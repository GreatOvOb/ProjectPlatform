import React, { useEffect, useState } from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi"; // ✅ API 불러오기
import DeleteConfirmModal from "../components/user/DeleteConfirmModal";
import LoginModal from "../components/user/LoginModal";

const MyPage = () => {
  const navigate = useNavigate();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const location = useLocation();
  const [show, setShow] = useState(false);
  // ✅ 계정 삭제 함수 (탈퇴 API 호출)
  const handleDeleteAccount = async () => {
    try {
      await authApi.deleteUser(); // 🔥 백엔드 API 요청
      alert("계정이 삭제되었습니다.");
      navigate("/"); // ✅ 메인 페이지로 이동
    } catch (error) {
      alert("계정 삭제에 실패했습니다.");
    }
  };

  // 로그인 되었는지 확인
  useEffect(() => {
    authApi.checkLogin().then((res) => {
      if (!res) {
        // 로그인 유도 창 활성화
        setShow(true);
      }
    })
  }, [])
  

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* 사이드바 */}
        <Col md={3} lg={2} className="bg-light p-3 border-end d-flex flex-column">
          <h5 className="fw-bold">바로가기</h5>
          <Nav className="flex-column">
            <Nav.Link onClick={() => navigate("/mypage")}>마이페이지</Nav.Link>
            <Nav.Link onClick={() => navigate("/mypage/alert")}>알람</Nav.Link>
          </Nav>

          <Nav className="flex-column mt-auto">
            <Nav.Link onClick={() => setShowDeleteConfirmModal(true)}>계정 탈퇴</Nav.Link>
          </Nav>
        </Col>

        {/* Outlet을 통해 동적 콘텐츠 변경 */}
        <Col xs={12} md={9} lg={10}>
          <Outlet />
        </Col>
      </Row>

      {/* 모달 */}
      <DeleteConfirmModal 
        show={showDeleteConfirmModal} 
        onHide={() => setShowDeleteConfirmModal(false)} 
        handleDeleteAccount={handleDeleteAccount} // ✅ 함수 전달
      />
      {/* 로그인 유도 모달 */}
      <LoginModal 
        parentShow={show}
        redirectUrl={location.pathname}
      />
    </Container>
  );
};

export default MyPage;
