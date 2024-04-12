import Image from "next/image";

const HomeImage = () => {
    const heroImage = "https://www.loliapi.com/acg/pc/";

    return (
        <Image
            src={heroImage}
            alt={"bg"}
            className={"-z-50 fixed"}
            width={0}
            height={0}
            sizes={"100vw"}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority={true}
            unoptimized={true}
        />
    )
}

export default HomeImage;
