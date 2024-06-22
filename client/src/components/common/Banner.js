import React, { memo } from "react"

const Banner = () => {
  return (
    <div className="w-full">
      <img
        src="https://img.freepik.com/premium-vector/shopping-online-modern-marketing-mobile-application-internet-shops-website-concept-web-page-design-website-banner-mobile-website-3d-vector-illustration_473922-253.jpg"
        alt="banner"
        className="md:h-[400px] w-full md:object-cover object-contain"
      />
    </div>
  )
}

export default memo(Banner)
