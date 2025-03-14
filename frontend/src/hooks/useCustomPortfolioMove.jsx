// 페이지 이동 관련 useNavigate 들을 한 곳에서 관리하기 위한 커스텀 훅
import { useState } from "react";
import {
	createSearchParams,
	useNavigate,
	useSearchParams,
} from "react-router-dom";

const getNum = (param, defaultValue) => {
	// param이 존재하지 않으면 기본값을 할당하고 존재하면 그 값을 인트로 변환해서 리턴하는 함수
	if (!param) {
		return defaultValue;
	}
	return parseInt(param);
};

const getString = (param, defaultValue) => {
	// param이 존재하지 않으면 기본값을 할당하고 존재하면 그 값을 리턴하는 함수
	if (!param) {
		return defaultValue;
	}
	return param;
};

export default function useCustomPortfolioMove() {
	const navigate = useNavigate();
	// 주소창의 쿼리스트링을 변수로 할당하는 함수: useSearchParams()
	const [queryParams] = useSearchParams();

	// 쿼리스트링 값이 존재하면 그 값을 가져오고, 존재하지 않으면 기본값을 사용하는 로직 작성.
	const page = getNum(queryParams.get("page"), 1);
	const size = getNum(queryParams.get("size"), 12);
	const searchQuery = getString(queryParams.get("query"), "");
	const searchSkills = getString(queryParams.getAll("querySkills"), []);
	const searchSortOption = getString(queryParams.get("sortOption"), "");

	// 변수로 저장되어있는 값을 주소창에서 사용할 수 있는 형태로 변환
	// ? page=1&size=12
	const queryDefaultParam = createSearchParams({
		page,
		size,
		query: searchQuery,
		sortOption: searchSortOption,
	});
	searchSkills.forEach((skill) => {
		queryDefaultParam.append("querySkills", skill);
	});
	const queryDefault = queryDefaultParam.toString();
	// 같은 페이지를 클릭했을 때 새로고침이 되어 데이터를 가져올 수 있도록 구현
	const [refresh, setRefresh] = useState(false);

	/**
	 *
	 * @param {*} pageParam page와 size 설정을 가지고있는 아규먼트
	 * 아규먼트가 있는 경우:
	 * 아규먼트의 page와 size의 값을 바탕으로 쿼리스트링을 생성하여 페이지를 이동
	 * 아규먼트가 없는 경우:
	 * 기본값인 page = 1, size = 10으로 쿼리스트링을 생성하여 페이지를 이동
	 */
	const moveToList = (pageParam) => {
		let queryStr = "";

		if (pageParam) {
			const pageNum = getNum(pageParam.page, 1);
			const sizeNum = getNum(pageParam.size, 12);
			queryStr = createSearchParams({
				page: pageNum,
				size: sizeNum,
			}).toString();
		} else {
			queryStr = queryDefault;
		}
		navigate({ pathname: "/portfolio/list", search: queryStr });
		// 함수를 호출할 때 마다 값이 변경됨
		setRefresh((prev) => !prev);
	};

	const moveToModify = (projectId) => {
		// 수정 페이지는 글 번호를 알아야 함. 아규먼트로 전달받음
		navigate({
			pathname: `../modify/${projectId}`,
			search: queryDefault,
		});
	};

	const moveToRead = (projectId) => {
		navigate({
			pathname: `/portfolio/list/${projectId}`,
			search: queryDefault,
		});
	};

	const moveToPortfolioSearch = (params) => {
		let queryStr = new URLSearchParams();
		if (params) {
			const pageNum = getNum(params.page, 1);
			const sizeNum = getNum(params.size, 12);
			const searchQueryString = getString(params.query, "");
			const searchSkills = params.querySkills || [];
			const searchSortOption = params.sortOption || "relevance";

			queryStr = new URLSearchParams({
				page: pageNum,
				size: sizeNum,
				query: searchQueryString,
				sortOption: searchSortOption,
			});
			searchSkills.forEach((skill) => {
				queryStr.append("querySkills", skill);
			});
		} else {
			queryStr = queryDefault;
		}
		// console.log(queryStr.toString());
		navigate({
			pathname: "/portfolio/search",
			search: queryStr.toString(),
		});
		// 함수를 호출할 때 마다 값이 변경됨
		setRefresh((prev) => !prev);
	};

	// refresh 값 반환
	return {
		moveToList,
		moveToModify,
		moveToRead,
		moveToPortfolioSearch,
		page,
		size,
		refresh,
	};
	// 커스텀 훅과 쿼리스트링에서 받아온 page 변수와 size 변수를 다른 페이지에서도 사용할 수 있게 반환
}
