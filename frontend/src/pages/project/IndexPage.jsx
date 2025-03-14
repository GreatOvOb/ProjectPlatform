import React, { useCallback, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";

const Indexpage = () => {
	// 동적 데이터 처리(페이징 처리 관련 변수 유지 등)
	const navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		if(location.pathname === '/project/list') {
			setActiveKey('1');
		} else if (location.pathname === '/project/add') {
			setActiveKey('2');
		} else {
			setActiveKey('');
		}
	}, [location])

	const [activeKey, setActiveKey] = useState('1');

	const handleSelect = (selectedKey) => {
		setActiveKey(selectedKey);
	}

	const {moveToList} = useCustomMove();

	const handleClickAdd = useCallback(() => {
		navigate({ pathname: "add" });
	}, [navigate]);

	return (
		// JoinProject 페이지에서만 보여줄 전체 레이아웃을 적용
		<div>
			<Nav variant="pills" className="my-3" activeKey={activeKey} onSelect={handleSelect}>
				<Nav.Item>
					<Nav.Link eventKey="1" onClick={moveToList} active={activeKey === '1'}>
						프로젝트 리스트
					</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="2" onClick={handleClickAdd} active={activeKey === '2'}>
						프로젝트 등록
					</Nav.Link>
				</Nav.Item>
			</Nav>
			<div>
				<Outlet />
			</div>
		</div>
	);
};

export default Indexpage;
