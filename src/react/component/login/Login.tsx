import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsFillKeyFill } from "react-icons/bs";
import './Login.css';

interface Props {
    setLogin: (isLogin: boolean) => void
}

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || ''
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET || ''

export default function Login({ setLogin }: Props) {

    const [showApiSetup, setShowApiSetup] = useState<boolean>(false)

    const [id, setId] = useState<string>(CLIENT_ID)
    const [key, setKey] = useState<string>(CLIENT_SECRET)

    const handleLogin = async (): Promise<void> => {

        if (!CLIENT_ID || !CLIENT_SECRET) {
            console.log('인증키 오류!')
            return;
        }


        try {
            const isLogin: boolean = await window.electron.loginWithGoogle(id, key);
            setLogin(isLogin); // 로그인 상태 업데이트
        } catch (error) {
            console.error('로그인 과정에서 오류 발생:', error);
        }
    };

    const exitProgram = () => {
        window.electron.exit()
    }

    const updateAuth = (e:React.FormEvent) => {
        e.preventDefault()
        setShowApiSetup(false)

    }

    return (
        <div className="Login">
            <div className="title">
                <h3>Focus</h3>
                <h3>Scheduler</h3>
            </div>
            <div className='login-area'>
                <button onClick={handleLogin}>
                    <GoogleBtn></GoogleBtn>
                </button>
            </div>
            <div className="bottom">
                <BsFillKeyFill className="key-btn" type="button" onClick={() => setShowApiSetup(!showApiSetup)} />
                {showApiSetup && <div className="api-setup-window scale-in-left">
                    <Form onSubmit={(e)=>updateAuth(e)}>
                        <div className="input-area">
                            <InputGroup size="sm">
                                <InputGroup.Text>ID</InputGroup.Text>
                                <Form.Control placeholder="Google Client Id" onChange={(e) => setId(e.target.value)}></Form.Control>
                            </InputGroup>
                            <InputGroup size="sm">
                                <InputGroup.Text>KEY</InputGroup.Text>
                                <Form.Control placeholder="Google Secret key" onChange={(e) => setKey(e.target.value)}></Form.Control>
                            </InputGroup>
                        </div>
                        <Button type="submit">Update</Button>
                    </Form>
                </div>}
            </div>
        </div>
    )
}

function GoogleBtn() {
    return (
        <svg width="189" height="40" viewBox="0 0 189 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="188" height="39" rx="3.5" fill="white" />
            <g clipPath="url(#clip0_760_7197)" fill="white">
                <path d="M31.6 20.2273C31.6 19.5182 31.5364 18.8364 31.4182 18.1818H22V22.05H27.3818C27.15 23.3 26.4455 24.3591 25.3864 25.0682V27.5773H28.6182C30.5091 25.8364 31.6 23.2727 31.6 20.2273V20.2273Z" fill="#4285F4" />
                <path d="M22 30C24.7 30 26.9636 29.1045 28.6181 27.5773L25.3863 25.0682C24.4909 25.6682 23.3454 26.0227 22 26.0227C19.3954 26.0227 17.1909 24.2636 16.4045 21.9H13.0636V24.4909C14.7091 27.7591 18.0909 30 22 30Z" fill="#34A853" />
                <path d="M16.4045 21.9C16.2045 21.3 16.0909 20.6591 16.0909 20C16.0909 19.3409 16.2045 18.7 16.4045 18.1V15.5091H13.0636C12.3864 16.8591 12 18.3864 12 20C12 21.6136 12.3864 23.1409 13.0636 24.4909L16.4045 21.9V21.9Z" fill="#FBBC04" />
                <path d="M22 13.9773C23.4681 13.9773 24.7863 14.4818 25.8227 15.4727L28.6909 12.6045C26.9591 10.9909 24.6954 10 22 10C18.0909 10 14.7091 12.2409 13.0636 15.5091L16.4045 18.1C17.1909 15.7364 19.3954 13.9773 22 13.9773Z" fill="#E94235" />
            </g>
            <path d="M48.8906 21.7598H50.5996C50.5449 22.4115 50.3626 22.9925 50.0527 23.5029C49.7428 24.0088 49.3076 24.4076 48.7471 24.6992C48.1865 24.9909 47.5052 25.1367 46.7031 25.1367C46.0879 25.1367 45.5342 25.0273 45.042 24.8086C44.5498 24.5853 44.1283 24.2708 43.7773 23.8652C43.4264 23.4551 43.1576 22.9606 42.9707 22.3818C42.7884 21.8031 42.6973 21.1559 42.6973 20.4404V19.6133C42.6973 18.8978 42.7907 18.2507 42.9775 17.6719C43.1689 17.0931 43.4424 16.5986 43.7979 16.1885C44.1533 15.7738 44.5794 15.457 45.0762 15.2383C45.5775 15.0195 46.1403 14.9102 46.7646 14.9102C47.5576 14.9102 48.2275 15.056 48.7744 15.3477C49.3213 15.6393 49.7451 16.0426 50.0459 16.5576C50.3512 17.0726 50.5381 17.6628 50.6064 18.3281H48.8975C48.8519 17.8997 48.7516 17.5329 48.5967 17.2275C48.4463 16.9222 48.223 16.6898 47.9268 16.5303C47.6305 16.3662 47.2432 16.2842 46.7646 16.2842C46.3727 16.2842 46.0309 16.3571 45.7393 16.5029C45.4476 16.6488 45.2038 16.863 45.0078 17.1455C44.8118 17.4281 44.6637 17.7767 44.5635 18.1914C44.4678 18.6016 44.4199 19.071 44.4199 19.5996V20.4404C44.4199 20.9417 44.4632 21.3975 44.5498 21.8076C44.641 22.2132 44.7777 22.5618 44.96 22.8535C45.1468 23.1452 45.3838 23.3708 45.6709 23.5303C45.958 23.6898 46.3021 23.7695 46.7031 23.7695C47.1908 23.7695 47.585 23.6921 47.8857 23.5371C48.1911 23.3822 48.4212 23.1566 48.5762 22.8604C48.7357 22.5596 48.8405 22.1927 48.8906 21.7598ZM51.6797 21.3838V21.2266C51.6797 20.6934 51.7572 20.1989 51.9121 19.7432C52.0671 19.2829 52.2904 18.8841 52.582 18.5469C52.8783 18.2051 53.2383 17.9408 53.6621 17.7539C54.0905 17.5625 54.5736 17.4668 55.1113 17.4668C55.6536 17.4668 56.1367 17.5625 56.5605 17.7539C56.9889 17.9408 57.3512 18.2051 57.6475 18.5469C57.9437 18.8841 58.1693 19.2829 58.3242 19.7432C58.4792 20.1989 58.5566 20.6934 58.5566 21.2266V21.3838C58.5566 21.917 58.4792 22.4115 58.3242 22.8672C58.1693 23.3229 57.9437 23.7217 57.6475 24.0635C57.3512 24.4007 56.9912 24.665 56.5674 24.8564C56.1436 25.0433 55.6628 25.1367 55.125 25.1367C54.5827 25.1367 54.0973 25.0433 53.6689 24.8564C53.2451 24.665 52.8851 24.4007 52.5889 24.0635C52.2926 23.7217 52.0671 23.3229 51.9121 22.8672C51.7572 22.4115 51.6797 21.917 51.6797 21.3838ZM53.3271 21.2266V21.3838C53.3271 21.7165 53.3613 22.0309 53.4297 22.3271C53.498 22.6234 53.6051 22.8831 53.751 23.1064C53.8968 23.3298 54.0837 23.5052 54.3115 23.6328C54.5394 23.7604 54.8105 23.8242 55.125 23.8242C55.4303 23.8242 55.6947 23.7604 55.918 23.6328C56.1458 23.5052 56.3327 23.3298 56.4785 23.1064C56.6243 22.8831 56.7314 22.6234 56.7998 22.3271C56.8727 22.0309 56.9092 21.7165 56.9092 21.3838V21.2266C56.9092 20.8984 56.8727 20.5885 56.7998 20.2969C56.7314 20.0007 56.6221 19.7386 56.4717 19.5107C56.3258 19.2829 56.139 19.1051 55.9111 18.9775C55.6878 18.8454 55.4212 18.7793 55.1113 18.7793C54.8014 18.7793 54.5326 18.8454 54.3047 18.9775C54.0814 19.1051 53.8968 19.2829 53.751 19.5107C53.6051 19.7386 53.498 20.0007 53.4297 20.2969C53.3613 20.5885 53.3271 20.8984 53.3271 21.2266ZM61.5713 19.1826V25H59.9238V17.6035H61.4756L61.5713 19.1826ZM61.2773 21.0283L60.7441 21.0215C60.7487 20.4974 60.8216 20.0166 60.9629 19.5791C61.1087 19.1416 61.3092 18.7656 61.5645 18.4512C61.8242 18.1367 62.1341 17.8952 62.4941 17.7266C62.8542 17.5534 63.2552 17.4668 63.6973 17.4668C64.0527 17.4668 64.374 17.5169 64.6611 17.6172C64.9528 17.7129 65.2012 17.8701 65.4062 18.0889C65.6159 18.3076 65.7754 18.5924 65.8848 18.9434C65.9941 19.2897 66.0488 19.7158 66.0488 20.2217V25H64.3945V20.2148C64.3945 19.8594 64.3421 19.5791 64.2373 19.374C64.137 19.1644 63.9889 19.0163 63.793 18.9297C63.6016 18.8385 63.3623 18.793 63.0752 18.793C62.7926 18.793 62.5397 18.8522 62.3164 18.9707C62.0931 19.0892 61.904 19.251 61.749 19.4561C61.5986 19.6611 61.4824 19.8981 61.4004 20.167C61.3184 20.4359 61.2773 20.723 61.2773 21.0283ZM71.1211 17.6035V18.8066H66.9512V17.6035H71.1211ZM68.1543 15.792H69.8018V22.9561C69.8018 23.1839 69.8337 23.3594 69.8975 23.4824C69.9658 23.6009 70.0592 23.6807 70.1777 23.7217C70.2962 23.7627 70.4352 23.7832 70.5947 23.7832C70.7087 23.7832 70.818 23.7764 70.9229 23.7627C71.0277 23.749 71.112 23.7354 71.1758 23.7217L71.1826 24.9795C71.0459 25.0205 70.8864 25.057 70.7041 25.0889C70.5264 25.1208 70.3213 25.1367 70.0889 25.1367C69.7106 25.1367 69.3757 25.0706 69.084 24.9385C68.7923 24.8018 68.5645 24.5807 68.4004 24.2754C68.2363 23.9701 68.1543 23.5645 68.1543 23.0586V15.792ZM74.1562 17.6035V25H72.502V17.6035H74.1562ZM72.3926 15.6621C72.3926 15.4115 72.4746 15.2041 72.6387 15.04C72.8073 14.8714 73.0397 14.7871 73.3359 14.7871C73.6276 14.7871 73.8577 14.8714 74.0264 15.04C74.195 15.2041 74.2793 15.4115 74.2793 15.6621C74.2793 15.9082 74.195 16.1133 74.0264 16.2773C73.8577 16.4414 73.6276 16.5234 73.3359 16.5234C73.0397 16.5234 72.8073 16.4414 72.6387 16.2773C72.4746 16.1133 72.3926 15.9082 72.3926 15.6621ZM77.5947 19.1826V25H75.9473V17.6035H77.499L77.5947 19.1826ZM77.3008 21.0283L76.7676 21.0215C76.7721 20.4974 76.8451 20.0166 76.9863 19.5791C77.1322 19.1416 77.3327 18.7656 77.5879 18.4512C77.8477 18.1367 78.1576 17.8952 78.5176 17.7266C78.8776 17.5534 79.2786 17.4668 79.7207 17.4668C80.0762 17.4668 80.3975 17.5169 80.6846 17.6172C80.9762 17.7129 81.2246 17.8701 81.4297 18.0889C81.6393 18.3076 81.7988 18.5924 81.9082 18.9434C82.0176 19.2897 82.0723 19.7158 82.0723 20.2217V25H80.418V20.2148C80.418 19.8594 80.3656 19.5791 80.2607 19.374C80.1605 19.1644 80.0124 19.0163 79.8164 18.9297C79.625 18.8385 79.3857 18.793 79.0986 18.793C78.8161 18.793 78.5632 18.8522 78.3398 18.9707C78.1165 19.0892 77.9274 19.251 77.7725 19.4561C77.6221 19.6611 77.5059 19.8981 77.4238 20.167C77.3418 20.4359 77.3008 20.723 77.3008 21.0283ZM88.2041 23.2568V17.6035H89.8584V25H88.2998L88.2041 23.2568ZM88.4365 21.7188L88.9902 21.7051C88.9902 22.2018 88.9355 22.6598 88.8262 23.0791C88.7168 23.4938 88.5482 23.8561 88.3203 24.166C88.0924 24.4714 87.8008 24.7106 87.4453 24.8838C87.0898 25.0524 86.6637 25.1367 86.167 25.1367C85.807 25.1367 85.4766 25.0843 85.1758 24.9795C84.875 24.8747 84.6152 24.7129 84.3965 24.4941C84.1823 24.2754 84.016 23.9906 83.8975 23.6396C83.779 23.2887 83.7197 22.8695 83.7197 22.3818V17.6035H85.3672V22.3955C85.3672 22.6644 85.3991 22.89 85.4629 23.0723C85.5267 23.25 85.6133 23.3936 85.7227 23.5029C85.832 23.6123 85.9596 23.6898 86.1055 23.7354C86.2513 23.7809 86.4062 23.8037 86.5703 23.8037C87.0397 23.8037 87.4089 23.7126 87.6777 23.5303C87.9512 23.3434 88.1449 23.0928 88.2588 22.7783C88.3773 22.4639 88.4365 22.1107 88.4365 21.7188ZM94.8076 25.1367C94.2607 25.1367 93.7663 25.0479 93.3242 24.8701C92.8867 24.6878 92.513 24.4349 92.2031 24.1113C91.8978 23.7878 91.6631 23.4072 91.499 22.9697C91.335 22.5322 91.2529 22.0605 91.2529 21.5547V21.2812C91.2529 20.7025 91.3372 20.1784 91.5059 19.709C91.6745 19.2396 91.9092 18.8385 92.21 18.5059C92.5107 18.1686 92.8662 17.9111 93.2764 17.7334C93.6865 17.5557 94.1309 17.4668 94.6094 17.4668C95.138 17.4668 95.6006 17.5557 95.9971 17.7334C96.3936 17.9111 96.7217 18.1618 96.9814 18.4854C97.2458 18.8044 97.4417 19.1849 97.5693 19.627C97.7015 20.069 97.7676 20.5566 97.7676 21.0898V21.7939H92.0527V20.6113H96.1406V20.4814C96.1315 20.1852 96.0723 19.9072 95.9629 19.6475C95.8581 19.3877 95.6963 19.1781 95.4775 19.0186C95.2588 18.859 94.9671 18.7793 94.6025 18.7793C94.3291 18.7793 94.0853 18.8385 93.8711 18.957C93.6615 19.071 93.486 19.2373 93.3447 19.4561C93.2035 19.6748 93.0941 19.9391 93.0166 20.249C92.9437 20.5544 92.9072 20.8984 92.9072 21.2812V21.5547C92.9072 21.8783 92.9505 22.179 93.0371 22.457C93.1283 22.7305 93.2604 22.9697 93.4336 23.1748C93.6068 23.3799 93.8164 23.5417 94.0625 23.6602C94.3086 23.7741 94.5889 23.8311 94.9033 23.8311C95.2998 23.8311 95.653 23.7513 95.9629 23.5918C96.2728 23.4323 96.5417 23.2067 96.7695 22.915L97.6377 23.7559C97.4782 23.9883 97.2708 24.2116 97.0156 24.4258C96.7604 24.6354 96.4482 24.8063 96.0791 24.9385C95.7145 25.0706 95.2907 25.1367 94.8076 25.1367ZM104.549 23.3594L106.258 17.6035H107.311L107.023 19.3262L105.301 25H104.357L104.549 23.3594ZM103.544 17.6035L104.877 23.3867L104.986 25H103.934L101.931 17.6035H103.544ZM108.91 23.3184L110.202 17.6035H111.809L109.812 25H108.76L108.91 23.3184ZM107.488 17.6035L109.177 23.291L109.389 25H108.445L106.702 19.3193L106.415 17.6035H107.488ZM114.693 17.6035V25H113.039V17.6035H114.693ZM112.93 15.6621C112.93 15.4115 113.012 15.2041 113.176 15.04C113.344 14.8714 113.577 14.7871 113.873 14.7871C114.165 14.7871 114.395 14.8714 114.563 15.04C114.732 15.2041 114.816 15.4115 114.816 15.6621C114.816 15.9082 114.732 16.1133 114.563 16.2773C114.395 16.4414 114.165 16.5234 113.873 16.5234C113.577 16.5234 113.344 16.4414 113.176 16.2773C113.012 16.1133 112.93 15.9082 112.93 15.6621ZM119.889 17.6035V18.8066H115.719V17.6035H119.889ZM116.922 15.792H118.569V22.9561C118.569 23.1839 118.601 23.3594 118.665 23.4824C118.733 23.6009 118.827 23.6807 118.945 23.7217C119.064 23.7627 119.203 23.7832 119.362 23.7832C119.476 23.7832 119.586 23.7764 119.69 23.7627C119.795 23.749 119.88 23.7354 119.943 23.7217L119.95 24.9795C119.813 25.0205 119.654 25.057 119.472 25.0889C119.294 25.1208 119.089 25.1367 118.856 25.1367C118.478 25.1367 118.143 25.0706 117.852 24.9385C117.56 24.8018 117.332 24.5807 117.168 24.2754C117.004 23.9701 116.922 23.5645 116.922 23.0586V15.792ZM122.787 14.5V25H121.146V14.5H122.787ZM122.5 21.0283L121.967 21.0215C121.971 20.5111 122.042 20.0394 122.179 19.6064C122.32 19.1735 122.516 18.7975 122.767 18.4785C123.022 18.1549 123.327 17.9066 123.683 17.7334C124.038 17.5557 124.432 17.4668 124.865 17.4668C125.23 17.4668 125.558 17.5169 125.85 17.6172C126.146 17.7174 126.401 17.8792 126.615 18.1025C126.829 18.3213 126.991 18.6084 127.101 18.9639C127.215 19.3148 127.271 19.7432 127.271 20.249V25H125.617V20.2354C125.617 19.8799 125.565 19.5973 125.46 19.3877C125.36 19.1781 125.212 19.0277 125.016 18.9365C124.82 18.8408 124.58 18.793 124.298 18.793C124.002 18.793 123.74 18.8522 123.512 18.9707C123.288 19.0892 123.102 19.251 122.951 19.4561C122.801 19.6611 122.687 19.8981 122.609 20.167C122.536 20.4359 122.5 20.723 122.5 21.0283ZM140.232 19.9141V23.7148C140.091 23.9017 139.87 24.1068 139.569 24.3301C139.273 24.5488 138.879 24.738 138.387 24.8975C137.895 25.057 137.282 25.1367 136.548 25.1367C135.924 25.1367 135.352 25.0319 134.832 24.8223C134.312 24.6081 133.864 24.2959 133.485 23.8857C133.112 23.4756 132.822 22.9766 132.617 22.3887C132.412 21.7962 132.31 21.1217 132.31 20.3652V19.6748C132.31 18.9229 132.403 18.2529 132.59 17.665C132.781 17.0726 133.055 16.5713 133.41 16.1611C133.766 15.751 134.194 15.4411 134.695 15.2314C135.201 15.0173 135.773 14.9102 136.411 14.9102C137.227 14.9102 137.901 15.0469 138.435 15.3203C138.972 15.5892 139.387 15.9629 139.679 16.4414C139.97 16.9199 140.155 17.4668 140.232 18.082H138.551C138.496 17.7357 138.389 17.4258 138.229 17.1523C138.075 16.8789 137.851 16.6647 137.56 16.5098C137.272 16.3503 136.899 16.2705 136.438 16.2705C136.042 16.2705 135.693 16.3457 135.393 16.4961C135.092 16.6465 134.841 16.8675 134.641 17.1592C134.445 17.4508 134.297 17.8063 134.196 18.2256C134.096 18.6449 134.046 19.1234 134.046 19.6611V20.3652C134.046 20.9121 134.103 21.3975 134.217 21.8213C134.335 22.2451 134.504 22.6029 134.723 22.8945C134.946 23.1862 135.217 23.4072 135.536 23.5576C135.855 23.7035 136.215 23.7764 136.616 23.7764C137.008 23.7764 137.329 23.7445 137.58 23.6807C137.831 23.6123 138.029 23.5326 138.175 23.4414C138.325 23.3457 138.441 23.2546 138.523 23.168V21.1924H136.452V19.9141H140.232ZM141.654 21.3838V21.2266C141.654 20.6934 141.732 20.1989 141.887 19.7432C142.042 19.2829 142.265 18.8841 142.557 18.5469C142.853 18.2051 143.213 17.9408 143.637 17.7539C144.065 17.5625 144.548 17.4668 145.086 17.4668C145.628 17.4668 146.111 17.5625 146.535 17.7539C146.964 17.9408 147.326 18.2051 147.622 18.5469C147.918 18.8841 148.144 19.2829 148.299 19.7432C148.454 20.1989 148.531 20.6934 148.531 21.2266V21.3838C148.531 21.917 148.454 22.4115 148.299 22.8672C148.144 23.3229 147.918 23.7217 147.622 24.0635C147.326 24.4007 146.966 24.665 146.542 24.8564C146.118 25.0433 145.637 25.1367 145.1 25.1367C144.557 25.1367 144.072 25.0433 143.644 24.8564C143.22 24.665 142.86 24.4007 142.563 24.0635C142.267 23.7217 142.042 23.3229 141.887 22.8672C141.732 22.4115 141.654 21.917 141.654 21.3838ZM143.302 21.2266V21.3838C143.302 21.7165 143.336 22.0309 143.404 22.3271C143.473 22.6234 143.58 22.8831 143.726 23.1064C143.871 23.3298 144.058 23.5052 144.286 23.6328C144.514 23.7604 144.785 23.8242 145.1 23.8242C145.405 23.8242 145.669 23.7604 145.893 23.6328C146.12 23.5052 146.307 23.3298 146.453 23.1064C146.599 22.8831 146.706 22.6234 146.774 22.3271C146.847 22.0309 146.884 21.7165 146.884 21.3838V21.2266C146.884 20.8984 146.847 20.5885 146.774 20.2969C146.706 20.0007 146.597 19.7386 146.446 19.5107C146.3 19.2829 146.114 19.1051 145.886 18.9775C145.662 18.8454 145.396 18.7793 145.086 18.7793C144.776 18.7793 144.507 18.8454 144.279 18.9775C144.056 19.1051 143.871 19.2829 143.726 19.5107C143.58 19.7386 143.473 20.0007 143.404 20.2969C143.336 20.5885 143.302 20.8984 143.302 21.2266ZM149.598 21.3838V21.2266C149.598 20.6934 149.675 20.1989 149.83 19.7432C149.985 19.2829 150.208 18.8841 150.5 18.5469C150.796 18.2051 151.156 17.9408 151.58 17.7539C152.008 17.5625 152.492 17.4668 153.029 17.4668C153.572 17.4668 154.055 17.5625 154.479 17.7539C154.907 17.9408 155.269 18.2051 155.565 18.5469C155.862 18.8841 156.087 19.2829 156.242 19.7432C156.397 20.1989 156.475 20.6934 156.475 21.2266V21.3838C156.475 21.917 156.397 22.4115 156.242 22.8672C156.087 23.3229 155.862 23.7217 155.565 24.0635C155.269 24.4007 154.909 24.665 154.485 24.8564C154.062 25.0433 153.581 25.1367 153.043 25.1367C152.501 25.1367 152.015 25.0433 151.587 24.8564C151.163 24.665 150.803 24.4007 150.507 24.0635C150.211 23.7217 149.985 23.3229 149.83 22.8672C149.675 22.4115 149.598 21.917 149.598 21.3838ZM151.245 21.2266V21.3838C151.245 21.7165 151.279 22.0309 151.348 22.3271C151.416 22.6234 151.523 22.8831 151.669 23.1064C151.815 23.3298 152.002 23.5052 152.229 23.6328C152.457 23.7604 152.729 23.8242 153.043 23.8242C153.348 23.8242 153.613 23.7604 153.836 23.6328C154.064 23.5052 154.251 23.3298 154.396 23.1064C154.542 22.8831 154.649 22.6234 154.718 22.3271C154.791 22.0309 154.827 21.7165 154.827 21.3838V21.2266C154.827 20.8984 154.791 20.5885 154.718 20.2969C154.649 20.0007 154.54 19.7386 154.39 19.5107C154.244 19.2829 154.057 19.1051 153.829 18.9775C153.606 18.8454 153.339 18.7793 153.029 18.7793C152.719 18.7793 152.451 18.8454 152.223 18.9775C151.999 19.1051 151.815 19.2829 151.669 19.5107C151.523 19.7386 151.416 20.0007 151.348 20.2969C151.279 20.5885 151.245 20.8984 151.245 21.2266ZM162.593 17.6035H164.09V24.7949C164.09 25.4603 163.949 26.0254 163.666 26.4902C163.383 26.9551 162.989 27.3083 162.483 27.5498C161.978 27.7959 161.392 27.9189 160.727 27.9189C160.444 27.9189 160.13 27.8779 159.783 27.7959C159.441 27.7139 159.109 27.5817 158.785 27.3994C158.466 27.2217 158.2 26.987 157.985 26.6953L158.758 25.7246C159.022 26.0391 159.314 26.2692 159.633 26.415C159.952 26.5609 160.287 26.6338 160.638 26.6338C161.016 26.6338 161.337 26.5632 161.602 26.4219C161.87 26.2852 162.078 26.0824 162.224 25.8135C162.369 25.5446 162.442 25.2165 162.442 24.8291V19.2783L162.593 17.6035ZM157.568 21.3838V21.2402C157.568 20.6797 157.637 20.1693 157.773 19.709C157.91 19.2441 158.106 18.8454 158.361 18.5127C158.617 18.1755 158.926 17.918 159.291 17.7402C159.656 17.5579 160.068 17.4668 160.528 17.4668C161.007 17.4668 161.415 17.5534 161.752 17.7266C162.094 17.8997 162.379 18.1481 162.606 18.4717C162.834 18.7907 163.012 19.1735 163.14 19.6201C163.272 20.0622 163.37 20.5544 163.434 21.0967V21.5547C163.374 22.0833 163.274 22.5664 163.133 23.0039C162.992 23.4414 162.805 23.8197 162.572 24.1387C162.34 24.4577 162.053 24.7038 161.711 24.877C161.374 25.0501 160.975 25.1367 160.515 25.1367C160.063 25.1367 159.656 25.0433 159.291 24.8564C158.931 24.6696 158.621 24.4076 158.361 24.0703C158.106 23.7331 157.91 23.3366 157.773 22.8809C157.637 22.4206 157.568 21.9215 157.568 21.3838ZM159.216 21.2402V21.3838C159.216 21.721 159.248 22.0355 159.312 22.3271C159.38 22.6188 159.482 22.8763 159.619 23.0996C159.76 23.3184 159.938 23.4915 160.152 23.6191C160.371 23.7422 160.629 23.8037 160.925 23.8037C161.312 23.8037 161.629 23.7217 161.875 23.5576C162.126 23.3936 162.317 23.1725 162.449 22.8945C162.586 22.612 162.682 22.2975 162.736 21.9512V20.7139C162.709 20.445 162.652 20.1943 162.565 19.9619C162.483 19.7295 162.372 19.5267 162.23 19.3535C162.089 19.1758 161.911 19.0391 161.697 18.9434C161.483 18.8431 161.23 18.793 160.938 18.793C160.642 18.793 160.385 18.8568 160.166 18.9844C159.947 19.112 159.767 19.2874 159.626 19.5107C159.489 19.734 159.387 19.9938 159.318 20.29C159.25 20.5863 159.216 20.903 159.216 21.2402ZM167.562 14.5V25H165.908V14.5H167.562ZM172.628 25.1367C172.081 25.1367 171.587 25.0479 171.145 24.8701C170.707 24.6878 170.333 24.4349 170.023 24.1113C169.718 23.7878 169.483 23.4072 169.319 22.9697C169.155 22.5322 169.073 22.0605 169.073 21.5547V21.2812C169.073 20.7025 169.158 20.1784 169.326 19.709C169.495 19.2396 169.729 18.8385 170.03 18.5059C170.331 18.1686 170.687 17.9111 171.097 17.7334C171.507 17.5557 171.951 17.4668 172.43 17.4668C172.958 17.4668 173.421 17.5557 173.817 17.7334C174.214 17.9111 174.542 18.1618 174.802 18.4854C175.066 18.8044 175.262 19.1849 175.39 19.627C175.522 20.069 175.588 20.5566 175.588 21.0898V21.7939H169.873V20.6113H173.961V20.4814C173.952 20.1852 173.893 19.9072 173.783 19.6475C173.678 19.3877 173.517 19.1781 173.298 19.0186C173.079 18.859 172.787 18.7793 172.423 18.7793C172.149 18.7793 171.906 18.8385 171.691 18.957C171.482 19.071 171.306 19.2373 171.165 19.4561C171.024 19.6748 170.914 19.9391 170.837 20.249C170.764 20.5544 170.728 20.8984 170.728 21.2812V21.5547C170.728 21.8783 170.771 22.179 170.857 22.457C170.949 22.7305 171.081 22.9697 171.254 23.1748C171.427 23.3799 171.637 23.5417 171.883 23.6602C172.129 23.7741 172.409 23.8311 172.724 23.8311C173.12 23.8311 173.473 23.7513 173.783 23.5918C174.093 23.4323 174.362 23.2067 174.59 22.915L175.458 23.7559C175.299 23.9883 175.091 24.2116 174.836 24.4258C174.581 24.6354 174.269 24.8063 173.899 24.9385C173.535 25.0706 173.111 25.1367 172.628 25.1367Z" fill="#1F1F1F" />
            <rect x="0.5" y="0.5" width="188" height="39" rx="3.5" stroke="#747775" />
            <defs>
                <clipPath id="clip0_760_7197">
                    <rect width="20" height="20" fill="white" transform="translate(12 10)" />
                </clipPath>
            </defs>
        </svg>
    )
}
