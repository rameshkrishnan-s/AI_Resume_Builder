import CallToAction from "../components/home/CallToAction";
import Banner from "../components/home/Banner";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import Testimonial from "../components/home/Testimonial";

const Home = () =>{
    return(
        <div>
            <Banner/>
            <Hero/>
            <Features/>
            <Testimonial/>
            <CallToAction/>
            <Footer/>
        </div>
    )
}

export default Home;