import React, { useEffect, useState, useRef} from "react";
import "./joinModalForm.css";
import {useSelector, useDispatch} from 'react-redux';
import { loginOpen, joinOpen, modalClose, searchOpen, searchClose } from "./modules/modalStore";

const JoinModalForm = (props) => {

    const modalOpen = useSelector(state => state.reducer.modalOpen);
    const dispatch = useDispatch();
    const email = props.email;
    
    const [tel, setTel] = useState('');
    const [telValid, setTelValid] = useState(false);
    const [telNotAllow, setTelNotAllow] = useState(true);
    const [certNotAllow, setCertNotAllow] = useState(true);
    const regex_tel = /^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/;
    const regex_pw =
        /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;

    const [pw, setPw] = useState('');
    const [pwValid, setPwValid] = useState(false);
    const [rePw, setRePw] = useState('');
    const [matchPwValid, setMatchPwValid] = useState(false);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checkedAll, setCheckedAll] = useState(false);

    const [time, setTime] = useState(0);
    const [timerStart, setTimerStart] = useState(false);
    const savedCallback = useRef();
    let min;
    let sec;

    const [joinNotAllow, setJoinNotAllow] = useState(true);

    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');
    let localStorage = window.localStorage;


    const handleEmail = e => {
        setLoginId(e.target.value);
        
    }

    // 인증번호 유효시간 타이머 

    const Timer = () => {
        setTime(299);  
        setTimerStart(true); 
        setCertNotAllow(false);
    }

    const callback = () => {
        
        if(time > 0){
         setTime(time-1);
        }
        
    }

    useEffect(()=> {
        savedCallback.current = callback;
    });

    useEffect(()=> {

        const tick =() => {
            savedCallback.current();
        }
        
        const timer = setInterval(tick,1000);
         return () => clearInterval(timer);
        
    }, []);

    
    // 전화번호 유효성 체크 

    const handleTel = (e) => {
        setTel(e.target.value);
        if(regex_tel.test(e.target.value)){
            setTelValid(true);
            setTelNotAllow(false);
        }else{
            setTelValid(false);
            setTelNotAllow(true);
        }
    };

    // 비밀번호 유효성 체크 

    const handlePw = (e) => {
        setPw(e.target.value);
        if(regex_pw.test(e.target.value)){
            setPwValid(true);
    
        }else{
            setPwValid(false);
        }
    }

    // 비밀번호 확인 유효성 체크

    const matchPw = (e) => {
        setRePw(e.target.value);
        if(pw === e.target.value){
            setMatchPwValid(true);
            setLoginPw(e.target.value);
        }else {
            setMatchPwValid(false);
        }

    }

    // 동의 사항 체크 부분

    const handleChkAll = (e) => {
        if(!checked1 && !checked2){
            setChecked1(true);
            setChecked2(true);
            setCheckedAll(true);
        }else if(checked1 && checked2) {
            setChecked1(false);
            setChecked2(false);
            setCheckedAll(false);
        }
    }

    const reverseChkAll = () => {
        if(checked1 && checked2){
            setCheckedAll(true);
        }else {
            setCheckedAll(false);
        }
    }

    const handleChk1 = (e) => {
        if(checked1){
            setChecked1(false);
            
        }else if(!checked1){
            setChecked1(true);
                
        }
    }

    const handleChk2 = (e) => {
        
        if(checked2 === true){
            setChecked2(false);  
          
        }else if(checked2 === false){
            setChecked2(true);
                  
        }
        
    }

    useEffect(()=> {
       reverseChkAll();
    },[checked1, checked2]);

    // 회원가입 폼 모두 입력, 검증 완료 시 회원 가입 버튼 활성화

    const handleJoin = () => {
        if(!telNotAllow && !certNotAllow && pwValid && matchPwValid && checkedAll){
            setJoinNotAllow(false);
        }
    };

    useEffect(() => {
        handleJoin();
    }, [telNotAllow, certNotAllow, pwValid, matchPwValid, checkedAll]);
            
    const submitForm = () => {
        localStorage.setItem('Id', loginId);
        localStorage.setItem('Pw', loginPw);
        dispatch(modalClose());
    }
    
    return (
        <>
            {modalOpen === 2 ? ( 
            <div class="join_form_background">
                <div class="join_form">
                    <div class="join_form_contents">
                        <div class="join_form_header">
                            <div>회원가입</div>
                            <div><button id="form_close" onClick={()=> dispatch(modalClose())}><img src="./img/close_FILL1_wght400_GRAD0_opsz48.png" alt="close"/></button></div>
                        </div>
        
                        <div class="join_form_email">
                            <span>이메일</span><br/> 
                            <input placeholder={email} value={email} onChange={handleEmail}disabled="true"/>
                        </div>

                        <div class="join_form_name">
                            <span>이름</span><br/> 
                            <input placeholder="이름을 입력해 주세요."/>
                        </div>
        
                        <div class="join_form_digit">
                            <span>휴대폰 번호</span><br/>
                            <select>
                                <option value="+82" selected>+82 South Korea</option>
                                <option value="+81">+81 Japan</option>
                                <option value="+886">+886 Taiwan</option>
                                <option value="+852">+852 Hong Kong</option>
                                <option value="+65">+65 Singapore</option>
                                <option value="+93">+93 Afghanistan</option>
                                <option value="+335">+335 Albania</option>
                                <option value="+213">+213 Algeria</option>
                            </select><br/>
                        <div>
                            <input placeholder="(예시) 01034567890" onChange={handleTel} value={tel}/>
                            <button disabled={telNotAllow} onClick={Timer}>인증번호 받기</button>
                        </div>
                        
                        <div className="errorMessageWrap">
                            {!telValid && tel.length > 0 && (
                            <div>올바른 전화번호를 입력해주세요.</div>
                            )}
                        </div>
                        <input id="join_form_digit_num" placeholder="인증번호를 입력해 주세요." disabled={certNotAllow}/>
                        {timerStart && (<span>인증번호 확인</span>)}
                        <div class="timeMessageWrap">
                            {timerStart  && (
                            <>
                            <div>인증번호가 요청되었습니다.</div>
                            <div>유효시간 {parseInt(time/60)}분 {time%60}초</div>
                            </>
                            )}
                        </div>   
                        </div>
        
                        <div class="join_form_password">
                            <span>비밀번호</span><br/>
                            <input type="password" placeholder="비밀번호를 입력해 주세요." onChange={handlePw} value={pw}/>
                            <div className="errorMessageWrap">
                            {!pwValid && pw.length > 0 && (
                            <div>올바르지 않은 비밀번호입니다.</div>
                            )}
                        </div>    
                        </div>
                        
        
                        <div class="join_form_password_confirm">
                            <input type="password"placeholder="비밀번호를 다시 한번 입력해 주세요." onChange={matchPw} value={rePw}/>
                            <div className="errorMessageWrap">
                            {!matchPwValid && rePw.length > 0 && (
                            <div>비밀번호가 서로 일치하지 않습니다.</div>
                            )}
                        </div>   
                            <p>영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합하여 8자 이상 입력해 주세요.</p>
                        </div>
        
                        <div class="join_form_agreement">
                            <input id="agreeAll_chk" type="checkbox" checked={checkedAll} onChange={handleChkAll}/> 전체동의 <br/>
                            <hr/>
                            <div>
                            <input id="gather_personal_chk" type="checkbox" checked={checked1} onChange={handleChk1} /> 개인정보 수집 및 이용 동의(필수) 
                            <button>자세히</button>
                            </div>
                            <div>    
                            <input id="announce_event_chk" type="checkbox" checked={checked2} onChange={handleChk2}/> 이벤트 소식 등 알림 정보 받기 
                            <button>자세히</button>
                            </div>
                        </div>
                    </div>
            
                <div class="join_button">
                    <button disabled={joinNotAllow} onClick={submitForm}> 회원가입하기 </button>
                </div>
                </div>    
            </div>
            ) : null}
        </>
    )
}

export default JoinModalForm;