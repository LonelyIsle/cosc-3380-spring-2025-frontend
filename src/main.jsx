import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { EmployeeProvider } from "@context/EmployeeContext.jsx";
import { CategoryProvider } from "@context/CategoryContext.jsx";
import { ProductProvider } from "@context/ProductContext.jsx";
import { CartProvider } from "@context/CartContext.jsx";
import { SaleProvider } from "@context/SalesContext";
import { CouponProvider } from "@context/CouponContext.jsx";
import { CustomerContextProvider } from "@context/CustomerContext.jsx";
import { ConfigProvider } from "@context/ConfigContext.jsx";
import { OrderProvider } from "@context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <CategoryProvider>
          <CartProvider>
            <SaleProvider>
              <EmployeeProvider>
                <CouponProvider>
                  <CustomerContextProvider>
                    <ConfigProvider>
                      <OrderProvider>
                        <App />
                      </OrderProvider>
                    </ConfigProvider>
                  </CustomerContextProvider>
                </CouponProvider>
              </EmployeeProvider>
            </SaleProvider>
          </CartProvider>
        </CategoryProvider>
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
);
