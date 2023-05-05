export default function TransactionMessage({ txHash }) {
    return (
      <div className="transaction-message">
        <p>
          La transaction a été envoyée avec succès. Suivez son avancement sur{' '}
          <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            Etherscan
          </a>
          .
        </p>
      </div>
    );
  }
  