import React,{useState} from 'react'
import { Form, Button, Card,Container,Row,Col} from 'react-bootstrap'
import AuthApi from '../api/authApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert('로그인 버튼 클릭');
    console.log(email, password);
    if (email === '' || password === '') {
        alert('이메일 주소와 비밀번호를 입력하세요.');
    } 
    else{
        try {
          const response = await AuthApi.login(email, password);
          console.log("서버에 보낸 정보"+response);
          if(response){
            alert('로그인 성공'); 
            console.log("로그인아이디:"+email+ "로그인비번"+password);
            window.location.href = '/'; //로그인 성공시 홈으로 이동
          }else{
            //401 에러일때
            alert('이메일 주소 또는 비밀번호가 올바르지 않습니다.');
          }
        } catch (error) {
          console.error("서버 에러", error);
          console.log(error.response);
          throw error;
        }
      }
    };

  return (
    
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center">로그인</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>이메일 주소</Form.Label>
                  <Form.Control 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소를 입력하세요." />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요." />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  로그인
                </Button>
              </Form>
              <Button variant="secondary" className="w-100 mt-3" href='/signup'>
                회원가입
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Login