import "../../InsJoinForm.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

function InsMyPageJoinedUpdateForm() {
  const [hasOtherVehicleUsage, setHasOtherVehicleUsage] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { productName } = useParams();
  useEffect(() => {
    if (!sessionStorage.getItem("jwtToken")) {
      console.error("접근 권한이 없습니다.");
      alert("로그인이 필요합니다.");
      navigate("/");
    }

    const checkJoined = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/mypage/renewable/fire/" + id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwtToken"),
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            sessionStorage.removeItem("jwtToken");
            navigate("/");
          } else {
            const errorData = await response.json();
            alert(errorData.message || "해당 보험이 존재하지 않습니다.");
          }
        }
      } catch (error) {
        console.error("보험 갱신 중 오류 발생:", error);
        alert("서버와의 통신에 실패했습니다.");

        navigate("/");
      }
    };
    checkJoined();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addressInput = document.querySelector(
      "input[name='propertyAddress']"
    );
    addressInput.disabled = false;
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    addressInput.disabled = true;

    // buildingType이 '기타'라면 입력된 값으로 덮어쓰기
    if (formObject.buildingType === "기타") {
      if (formObject.buildingTypeOther) {
        formObject.buildingType = formObject.buildingTypeOther;
      } else {
        alert("건물 유형의 기타 칸을 입력하세요.");
        return;
      }
    }

    try {
      const response = await fetch(
        "http://localhost:8080/mypage/renewable/fire/" + id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwtToken"),
          },
          body: JSON.stringify(formObject),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const id = data.insuranceId;
        navigate("/mypage/renewable");
      } else {
        if (response.status === 403) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          sessionStorage.removeItem("jwtToken");
          navigate("/");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "가입 신청에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("보험 가입 중 오류 발생:", error);
      alert("서버와의 통신에 실패했습니다.");
    }
  };

  return (
    <div id="contents" className="inner-wrap">
      <br />
      <br />
      <br />
      <br />

      <div class="inner inner_hidden">
        {/* 사이드바 */}
        <Sidebar />
        {/* 보험 상품 리스트 */}

        <div className="tab-area mt30">
          <div id="usGdcInfo02"></div>
          <div className="title-wrap">
            <p className="title-3">정보 갱신</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="board-form">
              <table>
                <colgroup>
                  <col />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>과거 화재 여부</th>
                    <td>
                      <div className="checkbox-group" id="previousFire">
                        <label>
                          <input
                            type="radio"
                            name="previousFire"
                            value="true"
                          />{" "}
                          예
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="previousFire"
                            value="false"
                          />{" "}
                          아니오
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>건물 내 평균 인원</th>
                    <td>
                      <input
                        id="occupants"
                        name="occupants"
                        type="number"
                        title="평균 인원 입력"
                        placeholder="평균 거주(상주) 인원 입력"
                        min = "1"
                        className="input-text"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="button-group mt30">
              <button type="submit" className="button navy" id="btnSubmit">
                다음
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InsMyPageJoinedUpdateForm;
