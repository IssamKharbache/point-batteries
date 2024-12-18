import SignupForm from "@/components/frontend/forms/SignupForm";
import React from "react";

const SignupPage = () => {
  return (
    <section className="h-auto">
      <div className="flex flex-col items-center justify-center ">
        <SignupForm />
      </div>
    </section>
  );
};

export default SignupPage;
